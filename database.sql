-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Jan 2026 pada 11.52
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sipalinggowes_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `peminjaman`
--

CREATE TABLE `peminjaman` (
  `peminjaman_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sepeda_id` int(11) DEFAULT NULL,
  `waktu_mulai` datetime DEFAULT current_timestamp(),
  `waktu_selesai_rencana` datetime DEFAULT NULL,
  `waktu_selesai_aktual` datetime DEFAULT NULL,
  `status_kembali` enum('Belum','Sudah','Terlambat') DEFAULT 'Belum',
  `denda` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `peminjaman`
--

INSERT INTO `peminjaman` (`peminjaman_id`, `user_id`, `sepeda_id`, `waktu_mulai`, `waktu_selesai_rencana`, `waktu_selesai_aktual`, `status_kembali`, `denda`) VALUES
(1, 7, 6, '2026-01-11 13:08:10', '2026-01-11 14:08:10', '2026-01-11 13:08:22', 'Sudah', 0.00),
(2, 8, 9, '2026-01-11 13:10:03', '2026-01-11 15:10:03', NULL, 'Belum', 0.00),
(3, 9, 8, '2026-01-11 13:10:59', '2026-01-11 15:10:59', '2026-01-11 13:11:12', 'Sudah', 0.00),
(4, 3, 6, '2026-01-11 13:21:52', '2026-01-11 14:21:52', '2026-01-11 13:22:01', 'Sudah', 0.00),
(5, 3, 7, '2026-01-11 13:22:37', '2026-01-11 15:22:37', '2026-01-11 13:22:43', 'Sudah', 0.00),
(6, 3, 7, '2026-01-11 13:23:51', '2026-01-11 14:23:51', '2026-01-11 13:23:59', 'Sudah', 0.00),
(7, 3, 5, '2026-01-11 13:27:46', '2026-01-11 15:27:46', '2026-01-11 13:27:54', 'Sudah', 0.00),
(8, 3, 8, '2026-01-11 17:31:05', '2026-01-11 18:31:05', '2026-01-11 17:31:30', 'Sudah', 0.00),
(9, 3, 8, '2026-01-11 17:31:17', '2026-01-11 19:31:17', '2026-01-11 17:31:25', 'Sudah', 0.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `saldo` decimal(10,2) DEFAULT 0.00,
  `no_telepon` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`user_id`, `nama`, `email`, `saldo`, `no_telepon`) VALUES
(1, 'Siska Putrirani', 'siska@gmail.com', 100000.00, NULL),
(2, 'Budi Santoso', 'budi@gmail.com', 50000.00, NULL),
(3, 'Siska Putrirani', NULL, 0.00, '083177459042'),
(4, 'jowo', NULL, 0.00, '2345678'),
(5, 'siska', NULL, 0.00, '12345678'),
(6, 'adit', NULL, 0.00, '123'),
(7, 'abqar', NULL, 0.00, '08127823478'),
(8, 'Siska', NULL, 0.00, '081373770494'),
(9, 'Siska', NULL, 0.00, '08123456789');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sepeda`
--

CREATE TABLE `sepeda` (
  `sepeda_id` int(11) NOT NULL,
  `merk` varchar(100) DEFAULT NULL,
  `jenis` varchar(50) DEFAULT NULL,
  `status` enum('Tersedia','Dipinjam','Perawatan') DEFAULT 'Tersedia',
  `harga_sewa` decimal(10,2) DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `stok` int(11) DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sepeda`
--

INSERT INTO `sepeda` (`sepeda_id`, `merk`, `jenis`, `status`, `harga_sewa`, `gambar`, `stok`) VALUES
(5, 'Polygon Xtrada', 'MTB', 'Tersedia', 15000.00, 'https://images.unsplash.com/photo-1576435728678-35d01fd97157?w=600', 20),
(6, 'Brompton M6L', 'Lipat', 'Tersedia', 25000.00, 'https://images.unsplash.com/photo-1485965120184-e224f723d621?w=600', 20),
(7, 'Wimcycle Pocket', 'Lipat', 'Tersedia', 10000.00, 'https://images.unsplash.com/photo-1507035895480-27dbdcd99362?w=600', 20),
(8, 'United Felipe', 'Balap', 'Tersedia', 30000.00, 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600', 20),
(9, 'Pacific Invert', 'BMX', 'Dipinjam', 12000.00, 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=600', 20);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD PRIMARY KEY (`peminjaman_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `sepeda_id` (`sepeda_id`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `sepeda`
--
ALTER TABLE `sepeda`
  ADD PRIMARY KEY (`sepeda_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `peminjaman`
--
ALTER TABLE `peminjaman`
  MODIFY `peminjaman_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `sepeda`
--
ALTER TABLE `sepeda`
  MODIFY `sepeda_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD CONSTRAINT `peminjaman_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`user_id`),
  ADD CONSTRAINT `peminjaman_ibfk_2` FOREIGN KEY (`sepeda_id`) REFERENCES `sepeda` (`sepeda_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
