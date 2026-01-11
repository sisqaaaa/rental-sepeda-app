const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Ini baris PENTING biar gambar & file web bisa dibuka
app.use(express.static(__dirname)); 
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// KONEKSI DATABASE
const db = mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'sipalinggowes_db'
});

db.connect(err => {
    if (err) console.error('Database Error:', err);
    else console.log('✅ Server Stok Ready!');
});

// --- API ROUTES ---

app.post('/api/auth', (req, res) => {
    const { nama, no_telepon } = req.body;
    db.query("SELECT * FROM pengguna WHERE no_telepon = ?", [no_telepon], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) res.send(result[0]);
        else {
            db.query("INSERT INTO pengguna (nama, no_telepon, saldo) VALUES (?, ?, 0)", [nama, no_telepon], (err2, res2) => {
                if (err2) return res.status(500).send(err2);
                res.send({ user_id: res2.insertId, nama, no_telepon });
            });
        }
    });
});

// GET SEPEDA (Ambil semua data, jangan difilter status, biar gak ilang)
app.get('/api/sepeda', (req, res) => {
    db.query("SELECT * FROM sepeda", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.get('/api/pinjaman/:user_id', (req, res) => {
    const sql = `SELECT p.*, s.merk, s.harga_sewa, s.jenis FROM peminjaman p JOIN sepeda s ON p.sepeda_id = s.sepeda_id WHERE p.user_id = ? AND p.status_kembali = 'Belum'`;
    db.query(sql, [req.params.user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// PINJAM (Kurangi Stok)
app.post('/api/pinjam', (req, res) => {
    const { user_id, sepeda_id, durasi_jam } = req.body;
    const waktu_selesai = new Date();
    waktu_selesai.setHours(waktu_selesai.getHours() + parseInt(durasi_jam));
    
    // 1. Cek Stok
    db.query("SELECT stok FROM sepeda WHERE sepeda_id = ?", [sepeda_id], (err, result) => {
        if(err || result.length === 0) return res.status(500).send("Error");
        if(result[0].stok <= 0) return res.status(400).send({message: "Stok Habis!"});

        // 2. Insert Peminjaman
        db.query("INSERT INTO peminjaman (user_id, sepeda_id, waktu_selesai_rencana) VALUES (?, ?, ?)", [user_id, sepeda_id, waktu_selesai], (err2) => {
            if (err2) return res.status(500).send(err2);
            
            // 3. Kurangi Stok (-1)
            db.query("UPDATE sepeda SET stok = stok - 1 WHERE sepeda_id = ?", [sepeda_id], (err3) => {
                res.send({ message: 'Berhasil' });
            });
        });
    });
});

// KEMBALI (Tambah Stok)
app.post('/api/kembali', (req, res) => {
    const { peminjaman_id, sepeda_id, harga_sewa } = req.body;
    
    db.query("SELECT waktu_selesai_rencana FROM peminjaman WHERE peminjaman_id = ?", [peminjaman_id], (err, results) => {
        const rencana = new Date(results[0].waktu_selesai_rencana);
        const aktual = new Date();
        let denda = 0;
        if (aktual > rencana) {
            const selisihJam = Math.ceil((aktual - rencana) / (1000 * 60 * 60));
            denda = selisihJam * (harga_sewa * 2);
        }
        
        db.query("UPDATE peminjaman SET waktu_selesai_aktual = ?, status_kembali = ?, denda = ? WHERE peminjaman_id = ?", [aktual, 'Sudah', denda, peminjaman_id], () => {
            
            // Balikin Stok (+1)
            db.query("UPDATE sepeda SET stok = stok + 1 WHERE sepeda_id = ?", [sepeda_id], () => {
                res.send({ message: 'Selesai', denda: denda });
            });
        });
    });
});

app.listen(3000, () => console.log('🚀 Server Berjalan...'));