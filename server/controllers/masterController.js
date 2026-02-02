const pool = require('../db');

exports.getMasterData = async (req, res) => {
  try {
    const layanan = await pool.query('SELECT * FROM master_layanan ORDER BY id ASC');
    const status = await pool.query('SELECT * FROM master_status ORDER BY sequence_order ASC');

    res.json({
      layanan: layanan.rows,
      status: status.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};