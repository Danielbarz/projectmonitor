const pool = require('../db');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT u.id, u.name, u.email, u.role_id, r.role_name as role, u.created_at 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id ASC
    `);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Assuming req.user.id comes from authentication middleware
    // For now, we'll take it from params or body for testing without auth middleware
    const { id } = req.params; 
    
    const user = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body; // Use 'username' from FE mapping to 'name' in DB

    let query, params;

    if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        query = 'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, role_id';
        params = [username, email, hashedPassword, id];
    } else {
        query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role_id';
        params = [username, email, id];
    }

    const updateUser = await pool.query(query, params);

    if (updateUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const bcrypt = require('bcryptjs');

// ... getAllUsers ...

// Update User (Role & Password) (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, password } = req.body;

    let query, params;

    if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        query = 'UPDATE users SET role_id = $1, password = $2 WHERE id = $3 RETURNING id, name, email, role_id';
        params = [role_id, hashedPassword, id];
    } else {
        query = 'UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, name, email, role_id';
        params = [role_id, id];
    }

    const updateUser = await pool.query(query, params);

    if (updateUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete User (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (deleteUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};