const pool = require('./db');
const bcrypt = require('bcryptjs');

const testLogin = async () => {
  try {
    const email = 'superadmin@telkom.ac.id';
    const password = 'password123';
    
    // Get user from database
    const user = await pool.query(`
      SELECT u.id, u.name, u.email, u.password, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1
    `, [email]);
    
    if (user.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.rows[0].email);
    console.log('Stored hash:', user.rows[0].password);
    
    // Generate fresh hash
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    console.log('New hash:', newHash);
    
    // Test password comparison
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log('Password valid?', validPassword);
    
    if (!validPassword) {
      console.log('❌ Password mismatch - need to re-seed');
    } else {
      console.log('✅ Password matches!');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
};

testLogin();
