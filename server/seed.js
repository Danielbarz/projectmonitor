const pool = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding...');

    // 1. Seed Roles
    console.log('... Seeding Roles');
    await pool.query(`
      INSERT INTO roles (id, role_name) VALUES
      (1, 'SUPERADMIN'),
      (2, 'ADMIN'),
      (3, 'USER')
      ON CONFLICT (role_name) DO NOTHING;
    `);

    // 2. Seed Master Layanan (Updated)
    console.log('... Seeding Master Layanan');
    const layanan = ['HSI', 'Astinet', 'Metro', 'VPN IP', 'WMS'];
    for (let i = 0; i < layanan.length; i++) {
        await pool.query(`
            INSERT INTO master_layanan (id, name) VALUES ($1, $2)
            ON CONFLICT (id) DO UPDATE SET name = $2;
        `, [i + 1, layanan[i]]);
    }
    await pool.query("SELECT setval('master_layanan_id_seq', (SELECT MAX(id) FROM master_layanan));");

    // 3. Seed Master Status (Updated Sequence)
    console.log('... Seeding Master Status');
    // Sequence: Belum Input -> Survey -> JT -> Progres PT 1 -> Completed -> Cancelled
    const statuses = ['Belum Input', 'Survey', 'JT', 'Progres PT 1', 'Completed', 'Cancelled'];
    for (let i = 0; i < statuses.length; i++) {
        await pool.query(`
            INSERT INTO master_status (id, status_name, sequence_order) VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE SET status_name = $2, sequence_order = $3;
        `, [i + 1, statuses[i], i + 1]);
    }
    await pool.query("SELECT setval('master_status_id_seq', (SELECT MAX(id) FROM master_status));");

    // 4. Seed Users
    console.log('... Seeding Users');
    const plainPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const users = [
      { name: 'Superadmin', email: 'superadmin@telkom.co.id', role_id: 1 },
      { name: 'Admin', email: 'admin@telkom.co.id', role_id: 2 },
      { name: 'User', email: 'user@telkom.co.id', role_id: 3 }
    ];

    for (const user of users) {
      const check = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
      if (check.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (name, email, password, role_id)
          VALUES ($1, $2, $3, $4)
        `, [user.name, user.email, hashedPassword, user.role_id]);
      } else {
        await pool.query(`
          UPDATE users SET password = $1 WHERE email = $2
        `, [hashedPassword, user.email]);
      }
    }

    console.log('✨ Seeding Completed Successfully!');

  } catch (err) {
    console.error('❌ Seeding Failed:', err.message);
  } finally {
    pool.end();
  }
};

seedDatabase();