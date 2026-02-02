-- ==========================================================
-- LANGKAH 1: JALANKAN INI SENDIRI UNTUK MEMBUAT DATABASE
-- ==========================================================
-- CREATE DATABASE project_management_db;
-- ==========================================================

-- 1. CLEANUP (Opsional: Hapus jika ingin reset ulang)
DROP TABLE IF EXISTS targets CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS project_notes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS master_status CASCADE;
DROP TABLE IF EXISTS master_layanan CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 2. ROLES
CREATE TABLE roles (
   id SERIAL PRIMARY KEY,
   role_name VARCHAR(50) UNIQUE NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MASTER DATA TABLES
CREATE TABLE master_layanan (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE master_status (
   id SERIAL PRIMARY KEY,
   status_name VARCHAR(50) NOT NULL,
   sequence_order INTEGER
);

-- 4. USER & AUTH
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   role_id INTEGER NOT NULL REFERENCES roles(id),
   is_active BOOLEAN DEFAULT TRUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   token TEXT UNIQUE NOT NULL,
   expires_at TIMESTAMP NOT NULL,
   revoked_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PROJECTS & TRACKING
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    layanan_id INTEGER REFERENCES master_layanan(id),
    paket_kecepatan VARCHAR(255),
   lokasi VARCHAR(255),
   alamat TEXT, 
   cp_pelanggan VARCHAR(255), 
   status_id INTEGER REFERENCES master_status(id),
   input_date DATE,
   target_rfs DATE,
   actual_rfs DATE,
   latitude DOUBLE PRECISION,
   longitude DOUBLE PRECISION,
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_status (
   id SERIAL PRIMARY KEY,
   project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
   status_id INTEGER NOT NULL REFERENCES master_status(id),
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_notes (
   id SERIAL PRIMARY KEY,
   project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
   keterangan TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   project_id INTEGER REFERENCES projects(id),
   message TEXT NOT NULL,
   is_read BOOLEAN DEFAULT FALSE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE targets (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   period_start DATE NOT NULL,
   period_end DATE NOT NULL,
   product_id INTEGER REFERENCES master_layanan(id),
   target_rfs INTEGER,
   actual_rfs INTEGER,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. INITIAL DATA (DML)
-- Roles
INSERT INTO roles (role_name) VALUES ('SUPERADMIN'), ('ADMIN'), ('USER') ON CONFLICT DO NOTHING;

-- Master Layanan
INSERT INTO master_layanan (id, name) VALUES
(1, 'HSI'),
(2, 'Astinet'),
(3, 'Metro'),
(4, 'VPN IP'),
(5, 'WMS')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Reset sequence for master_layanan
SELECT setval('master_layanan_id_seq', (SELECT MAX(id) FROM master_layanan));

-- Master Status
INSERT INTO master_status (id, status_name, sequence_order) VALUES 
(1, 'Belum Input', 1), 
(2, 'Survey', 2), 
(3, 'JT', 3), 
(4, 'Progres PT 1', 4), 
(5, 'Completed', 5),
(6, 'Cancelled', 6)
ON CONFLICT (id) DO UPDATE SET status_name = EXCLUDED.status_name, sequence_order = EXCLUDED.sequence_order;