const pool = require('../db');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        ml.name as layanan_name,
        ms.status_name
      FROM projects p
      LEFT JOIN master_layanan ml ON p.layanan_id = ml.id
      LEFT JOIN master_status ms ON p.status_id = ms.id
      ORDER BY p.created_at DESC
    `;
    const allProjects = await pool.query(query);
    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.*,
        ml.name as layanan_name,
        ms.status_name,
        ms.sequence_order as status_sequence
      FROM projects p
      LEFT JOIN master_layanan ml ON p.layanan_id = ml.id
      LEFT JOIN master_status ms ON p.status_id = ms.id
      WHERE p.id = $1
    `;
    const project = await pool.query(query, [id]);
    
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectData = project.rows[0];

    // Fetch Last Valid Status (Before Cancelled) from History
    if (projectData.status_name === 'Cancelled') {
        const lastStatusLog = await pool.query(`
            SELECT ms.sequence_order 
            FROM project_status psl
            JOIN master_status ms ON psl.status_id = ms.id
            WHERE psl.project_id = $1 AND psl.status_id != 6 
            ORDER BY psl.updated_at DESC 
            LIMIT 1
        `, [id]);

        if (lastStatusLog.rows.length > 0) {
            projectData.last_status_sequence = lastStatusLog.rows[0].sequence_order;
        }
    }

    // Fetch Notes History
    const notesRes = await pool.query(
      'SELECT * FROM project_notes WHERE project_id = $1 ORDER BY created_at DESC',
      [id]
    );
    
    projectData.notes = notesRes.rows;

    res.json(projectData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    let { 
      order_id, 
      layanan_id, 
      paket_kecepatan, 
      lokasi, 
      alamat, 
      cp_pelanggan, 
      status_id, 
      input_date,
      target_rfs, 
      actual_rfs, 
      latitude, 
      longitude, 
      description 
    } = req.body;

    // Sanitize
    if (layanan_id === '') layanan_id = null;
    if (status_id === '') status_id = null;
    if (input_date === '') input_date = null;
    if (target_rfs === '') target_rfs = null;
    if (actual_rfs === '') actual_rfs = null;
    if (latitude === '') latitude = null;
    if (longitude === '') longitude = null;

    const newProject = await pool.query(
      `INSERT INTO projects (
        order_id, layanan_id, paket_kecepatan, lokasi, alamat, 
        cp_pelanggan, status_id, input_date, target_rfs, actual_rfs, latitude, longitude, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        order_id, layanan_id, paket_kecepatan, lokasi, alamat, 
        cp_pelanggan, status_id, input_date, target_rfs, actual_rfs, latitude, longitude, description
      ]
    );

    // Insert Initial Note
    if (description) {
        await pool.query(
            'INSERT INTO project_notes (project_id, keterangan) VALUES ($1, $2)',
            [newProject.rows[0].id, description]
        );
    }

    // Insert Initial Status Log
    await pool.query(
        'INSERT INTO project_status (project_id, status_id) VALUES ($1, $2)',
        [newProject.rows[0].id, status_id || 1]
    );

    res.json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let { 
      order_id, layanan_id, paket_kecepatan, lokasi, alamat, 
      cp_pelanggan, status_id, input_date, target_rfs, actual_rfs, latitude, longitude, 
      description,
      new_note
    } = req.body;

    // Sanitize
    if (layanan_id === '') layanan_id = null;
    if (status_id === '') status_id = null;
    if (input_date === '') input_date = null;
    if (target_rfs === '') target_rfs = null;
    if (actual_rfs === '') actual_rfs = null;
    if (latitude === '') latitude = null;
    if (longitude === '') longitude = null;

    // 1. Get Current Data for Status Check
    const currentProjectRes = await pool.query('SELECT status_id FROM projects WHERE id = $1', [id]);
    if (currentProjectRes.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    
    const oldStatusId = currentProjectRes.rows[0].status_id;

    // Logic: If status changed, log it to history
    if (status_id && parseInt(status_id) !== oldStatusId) {
        await pool.query(
            'INSERT INTO project_status (project_id, status_id) VALUES ($1, $2)',
            [id, status_id]
        );
    }

    // 2. Handle New Note
    const noteToSave = new_note || description; 

    if (noteToSave && noteToSave.trim() !== '') {
        await pool.query(
            'INSERT INTO project_notes (project_id, keterangan) VALUES ($1, $2)',
            [id, noteToSave]
        );
    }

    // 3. Update Main Project Data
    const updateProject = await pool.query(
      `UPDATE projects SET 
        order_id = $1, layanan_id = $2, paket_kecepatan = $3, 
        lokasi = $4, alamat = $5, cp_pelanggan = $6, status_id = $7, 
        input_date = $8, target_rfs = $9, actual_rfs = $10, latitude = $11, longitude = $12, 
        description = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14 RETURNING *`,
      [
        order_id, layanan_id, paket_kecepatan, lokasi, alamat, 
        cp_pelanggan, status_id, input_date, target_rfs, actual_rfs, latitude, longitude, 
        noteToSave,
        id
      ]
    );

    if (updateProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updateProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProject = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (deleteProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Reset All Projects (TRUNCATE)
exports.resetProjects = async (req, res) => {
  try {
    // Cascade will delete related notes and status logs
    await pool.query('TRUNCATE TABLE projects RESTART IDENTITY CASCADE');
    res.json({ message: 'All project data has been reset successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during reset');
  }
};

// Import Projects from Excel/CSV
const xlsx = require('xlsx');

exports.importProjects = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an excel or csv file' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    if (rawData.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const layananRes = await pool.query('SELECT id, name FROM master_layanan');
    const statusRes = await pool.query('SELECT id, status_name FROM master_status');

    const layananMap = {};
    layananRes.rows.forEach(r => layananMap[r.name.toLowerCase()] = r.id);

    const statusMap = {};
    statusRes.rows.forEach(r => statusMap[r.status_name.toLowerCase()] = r.id);

    let successCount = 0;
    let errors = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedRow[cleanKey] = row[key];
      });

      try {
        const serviceName = normalizedRow['jenislayanan'] || '';
        const statusName = normalizedRow['statusorder'] || 'OGP'; 
        
        const layanan_id = layananMap[serviceName.toString().toLowerCase()] || null;
        const status_id = statusMap[statusName.toString().toLowerCase()] || 1; 

        let lat = null;
        let lng = null;
        const combinedCoord = normalizedRow['longlat'];

        if (combinedCoord && typeof combinedCoord === 'string') {
            let parts = combinedCoord.split(',');
            if (parts.length < 2) parts = combinedCoord.trim().split(/\s+/);

            if (parts.length >= 2) {
                let part1 = parts[0].trim();
                let part2 = parts[1].trim();
                part1 = part1.replace(/[^0-9.-]/g, '');
                part2 = part2.replace(/[^0-9.-]/g, '');

                if (!isNaN(parseFloat(part1))) lat = parseFloat(part1);
                if (!isNaN(parseFloat(part2))) lng = parseFloat(part2);
            }
        }

        const insertedProject = await pool.query(
          `INSERT INTO projects (
            order_id, layanan_id, paket_kecepatan, lokasi, alamat, 
            cp_pelanggan, status_id, input_date, target_rfs, actual_rfs, latitude, longitude, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
          [
            normalizedRow['orderid'] || `AUTO-${Date.now()}-${i}`,
            layanan_id,
            normalizedRow['paketkecepatan'],
            normalizedRow['lokasi'],
            normalizedRow['alamat'],
            normalizedRow['cppelanggan'],
            status_id,
            normalizedRow['inputdate'] || normalizedRow['tanggalinput'] || null,
            normalizedRow['targetrfs'] || null,
            normalizedRow['actualrfs'] || null,
            lat,
            lng,
            normalizedRow['description'] || normalizedRow['keterangan'] || ''
          ]
        );

        const desc = normalizedRow['description'] || normalizedRow['keterangan'];
        if (desc) {
            await pool.query(
                'INSERT INTO project_notes (project_id, keterangan) VALUES ($1, $2)',
                [insertedProject.rows[0].id, desc]
            );
        }

        await pool.query(
            'INSERT INTO project_status (project_id, status_id) VALUES ($1, $2)',
            [insertedProject.rows[0].id, status_id || 1]
        );

        successCount++;
      } catch (err) {
        console.error(`Row ${i + 1} Error:`, err.message);
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    res.json({ 
      message: `Import finished. Success: ${successCount}, Failed: ${errors.length}`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error processing file');
  }
};