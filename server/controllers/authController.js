const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h' // Token valid for 24 hours
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    // Note: Frontend sends 'username', DB expects 'name'
    const { username, email, password } = req.body;
    
    // 1. Validasi Input Dasar
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Mohon lengkapi semua data.' });
    }

    // 2. Cek apakah email sudah terdaftar
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain.' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Ambil Role ID Default (USER)
    // Query ini mencari ID untuk role 'USER'. Jika tidak ada, fallback ke ID 3 (biasanya user) atau error.
    const roleResult = await pool.query("SELECT id FROM roles WHERE role_name = 'USER'");
    
    let userRoleId;
    if (roleResult.rows.length > 0) {
        userRoleId = roleResult.rows[0].id;
    } else {
        // Fallback or Handle Error if role table is empty/setup wrong
        // For safety, let's assume standard seeding: 3 = USER
        userRoleId = 3; 
    }

    // 5. Masukkan User Baru ke Database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id',
      [username, email, hashedPassword, userRoleId]
    );

    // 6. Generate Token langsung (Login otomatis setelah register)
    const token = generateToken(newUser.rows[0].id, 'USER');

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: 'USER'
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error saat Registrasi' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: password ? '***' : 'MISSING' });

    // 1. Cek apakah user ada
    // Kita join dengan table roles supaya bisa dapat nama rolenya (misal: "ADMIN")
    const user = await pool.query(`
      SELECT u.id, u.name, u.email, u.password, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1
    `, [email]);
    
    if (user.rows.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    
    console.log('✅ User found:', user.rows[0].email);

    // 2. Cek Password (Compare Hash)
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    console.log('Password valid?', validPassword);
    
    if (!validPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 3. Generate Token
    const token = generateToken(user.rows[0].id, user.rows[0].role_name);

    console.log('✅ Login successful');

    // 4. Kirim Respon
    res.json({ 
      message: "Login berhasil", 
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role_name
      } 
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error saat Login');
  }
};