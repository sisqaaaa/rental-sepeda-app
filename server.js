const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); 
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// KONEKSI DATABASE (AIVEN / RENDER / VERCEL)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) console.log('⚠️ Error Koneksi DB:', err.message);
    else console.log('✅ Terhubung ke Database Aiven!');
});

// --- FITUR MAGIC: SETUP DATABASE ---
app.get('/setup-database', (req, res) => {
    const q1 = `CREATE TABLE IF NOT EXISTS pengguna (user_id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100), no_telepon VARCHAR(20), saldo INT DEFAULT 0)`;
    const q2 = `CREATE TABLE IF NOT EXISTS sepeda (sepeda_id INT AUTO_INCREMENT PRIMARY KEY, merk VARCHAR(100), jenis VARCHAR(50), harga_sewa INT, stok INT, status VARCHAR(50), gambar TEXT)`;
    const q3 = `CREATE TABLE IF NOT EXISTS peminjaman (peminjaman_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, sepeda_id INT, waktu_pinjam TIMESTAMP DEFAULT CURRENT_TIMESTAMP, waktu_selesai_rencana DATETIME, waktu_selesai_aktual DATETIME, status_kembali VARCHAR(20) DEFAULT 'Belum', denda INT DEFAULT 0)`;
    
    // Isi Stok Awal
    const q4 = `INSERT IGNORE INTO sepeda (sepeda_id, merk, jenis, harga_sewa, stok, status, gambar) VALUES 
    (1, 'Polygon Xtrada', 'MTB', 15000, 20, 'Tersedia', ''),
    (2, 'Brompton M6L', 'Lipat', 25000, 20, 'Tersedia', ''),
    (3, 'Wimcycle Pocket', 'Lipat', 10000, 20, 'Tersedia', ''),
    (4, 'United Felipe', 'Balap', 30000, 20, 'Tersedia', ''),
    (5, 'Pacific Invert', 'BMX', 12000, 20, 'Tersedia', '')`;

    db.query(q1, () => {
        db.query(q2, () => {
            db.query(q3, () => {
                db.query(q4, (err) => {
                    if(err) res.send("Gagal: " + err.message);
                    else res.send("<h1>✅ BERHASIL! Database sudah terisi. Silakan hapus /setup-database dari link.</h1>");
                });
            });
        });
    });
});

// --- API UTAMA ---
app.post('/api/auth', (req, res) => {
    const { nama, no_telepon } = req.body;
    db.query("SELECT * FROM pengguna WHERE no_telepon = ?", [no_telepon], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) res.send(result[0]);
        else {
            db.query("INSERT INTO pengguna (nama, no_telepon) VALUES (?, ?)", [nama, no_telepon], (err2, res2) => {
                if (err2) return res.status(500).send(err2);
                res.send({ user_id: res2.insertId, nama, no_telepon });
            });
        }
    });
});

app.get('/api/sepeda', (req, res) => {
    db.query("SELECT * FROM sepeda", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.get('/api/pinjaman/:user_id', (req, res) => {
    db.query(`SELECT p.*, s.merk, s.harga_sewa, s.jenis FROM peminjaman p JOIN sepeda s ON p.sepeda_id = s.sepeda_id WHERE p.user_id = ? AND p.status_kembali = 'Belum'`, [req.params.user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.post('/api/pinjam', (req, res) => {
    const { user_id, sepeda_id, durasi_jam } = req.body;
    const waktu_selesai = new Date();
    waktu_selesai.setHours(waktu_selesai.getHours() + parseInt(durasi_jam));
    
    db.query("SELECT stok FROM sepeda WHERE sepeda_id = ?", [sepeda_id], (err, result) => {
        if(err || result.length === 0 || result[0].stok <= 0) return res.status(400).send({message: "Stok Habis!"});
        db.query("INSERT INTO peminjaman (user_id, sepeda_id, waktu_selesai_rencana) VALUES (?, ?, ?)", [user_id, sepeda_id, waktu_selesai], (err2) => {
            if (err2) return res.status(500).send(err2);
            db.query("UPDATE sepeda SET stok = stok - 1 WHERE sepeda_id = ?", [sepeda_id], () => res.send({ message: 'Berhasil' }));
        });
    });
});

app.post('/api/kembali', (req, res) => {
    const { peminjaman_id, sepeda_id, harga_sewa } = req.body;
    db.query("SELECT waktu_selesai_rencana FROM peminjaman WHERE peminjaman_id = ?", [peminjaman_id], (err, results) => {
        const denda = (new Date() > new Date(results[0].waktu_selesai_rencana)) ? Math.ceil((new Date() - new Date(results[0].waktu_selesai_rencana)) / 36e5) * (harga_sewa * 2) : 0;
        db.query("UPDATE peminjaman SET waktu_selesai_aktual = NOW(), status_kembali = 'Sudah', denda = ? WHERE peminjaman_id = ?", [denda, peminjaman_id], () => {
            db.query("UPDATE sepeda SET stok = stok + 1 WHERE sepeda_id = ?", [sepeda_id], () => res.send({ message: 'Selesai', denda }));
        });
    });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
// Update baru untuk Vercel