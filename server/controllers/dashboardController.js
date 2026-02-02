const pool = require('../db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Run multiple queries in parallel for efficiency
    const totalProjectsQuery = pool.query('SELECT COUNT(*) FROM projects');
    
    // OGP: All projects EXCEPT 'Completed' and 'JT'
    const ogpQuery = pool.query(`
      SELECT COUNT(*) FROM projects p 
      JOIN master_status ms ON p.status_id = ms.id 
      WHERE ms.status_name != 'Completed' AND ms.status_name != 'JT'
    `);
    
    const jtQuery = pool.query(`
      SELECT COUNT(*) FROM projects p 
      JOIN master_status ms ON p.status_id = ms.id 
      WHERE ms.status_name = 'JT'
    `);
    
    const completedQuery = pool.query(`
      SELECT COUNT(*) FROM projects p 
      JOIN master_status ms ON p.status_id = ms.id 
      WHERE ms.status_name = 'Completed'
    `);

    // On-Time RFS Query
    const onTimeQuery = pool.query(`
      SELECT COUNT(*) FROM projects 
      WHERE actual_rfs IS NOT NULL 
      AND target_rfs IS NOT NULL 
      AND actual_rfs <= target_rfs
    `);

    // Await all promises
    const [total, ogp, jt, completed, onTime] = await Promise.all([
      totalProjectsQuery, 
      ogpQuery, 
      jtQuery, 
      completedQuery,
      onTimeQuery
    ]);

    res.json({
      total_projects: parseInt(total.rows[0].count),
      ogp: parseInt(ogp.rows[0].count),
      jt: parseInt(jt.rows[0].count),
      completed: parseInt(completed.rows[0].count),
      on_time_rfs: parseInt(onTime.rows[0].count)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};