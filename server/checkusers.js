const pool = require('./db');

const checkUsers = async () => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `);
    console.log('Users in database:');
    result.rows.forEach(user => {
      console.log(`${user.name}: ${user.email} - ${user.role_name}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
};

checkUsers();