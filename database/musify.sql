-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Gen 24, 2022 alle 19:32
-- Versione del server: 10.4.21-MariaDB
-- Versione PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `musify`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `genre` varchar(20) NOT NULL,
  `release_date` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `albums`
--

INSERT INTO `albums` (`id`, `name`, `genre`, `release_date`) VALUES
(1, 'A Head Full Of Dreams', 'Pop', 2021),
(2, 'Living Things', 'Hard Rock', 2021),
(3, 'The Days _Nights (EP)', 'Dance', 2021),
(4, 'Some Nights - Single', 'Alternativa', 2012),
(5, 'We Are Young - Single', 'Alternativa', 2011),
(6, 'Memories - Single', 'Pop', 2019),
(7, 'Don\'t Stop Me Now - Single', 'Rock', 1978),
(8, 'We Are The Champions - Single', 'Rock', 2000),
(9, 'Misery - Single', 'Pop', 2014),
(10, 'V', 'Pop', 2015);

-- --------------------------------------------------------

--
-- Struttura della tabella `artists`
--

CREATE TABLE `artists` (
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `artists`
--

INSERT INTO `artists` (`name`) VALUES
('Avicii'),
('Coldplay'),
('Fun'),
('Linkin Park'),
('Maroon 5'),
('Queen');

-- --------------------------------------------------------

--
-- Struttura della tabella `artists_albums`
--

CREATE TABLE `artists_albums` (
  `artist_name` varchar(20) NOT NULL,
  `album_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `artists_albums`
--

INSERT INTO `artists_albums` (`artist_name`, `album_id`) VALUES
('Avicii', 3),
('Coldplay', 1),
('Fun', 4),
('Fun', 5),
('Linkin Park', 2),
('Maroon 5', 6),
('Maroon 5', 9),
('Maroon 5', 10),
('Queen', 7),
('Queen', 8);

-- --------------------------------------------------------

--
-- Struttura della tabella `playlists`
--

CREATE TABLE `playlists` (
  `user` varchar(20) NOT NULL,
  `pl_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `playlists`
--

INSERT INTO `playlists` (`user`, `pl_name`) VALUES
('Agostino', 'Relax');

-- --------------------------------------------------------

--
-- Struttura della tabella `playlists_songs`
--

CREATE TABLE `playlists_songs` (
  `user` varchar(20) NOT NULL,
  `pl_name` varchar(20) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `playlists_songs`
--

INSERT INTO `playlists_songs` (`user`, `pl_name`, `song_id`) VALUES
('Agostino', 'Relax', 29),
('Agostino', 'Relax', 32);

-- --------------------------------------------------------

--
-- Struttura della tabella `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `length` time NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `songs`
--

INSERT INTO `songs` (`id`, `name`, `length`, `hidden`) VALUES
(1, 'The Days (Henrik B Remix)', '00:03:56', 1),
(2, 'The Days', '00:04:38', 0),
(3, 'The Nights (Felix J Remix)', '00:03:20', 0),
(4, 'The Nights', '00:02:56', 0),
(5, 'A Head Full Of Dreams', '00:03:43', 1),
(6, 'Adventure Of A Lifetime', '00:04:23', 0),
(7, 'Amazing Day', '00:04:31', 1),
(8, 'Army Of One', '00:06:16', 1),
(9, 'Bird', '00:03:49', 0),
(10, 'Colour Spectrum', '00:01:00', 0),
(11, 'Everglow', '00:04:42', 0),
(12, 'Fun (feat. Tove Lo)', '00:04:27', 0),
(13, 'Hymn For The Weekend', '00:04:18', 0),
(14, 'Kaleidoscope', '00:01:51', 0),
(15, 'Miracles', '00:03:55', 0),
(16, 'Up&Up', '00:06:45', 0),
(17, 'Burn It Down', '00:03:51', 0),
(18, 'Castle Of Glass', '00:03:25', 0),
(19, 'I\'ll Be Gone', '00:03:31', 0),
(20, 'In My Remains', '00:03:20', 0),
(21, 'Lies Greed Misery', '00:02:27', 0),
(22, 'Lost In The Echo', '00:03:25', 0),
(23, 'Powerless', '00:03:43', 0),
(24, 'Roads Untraveled', '00:03:49', 0),
(25, 'Skin To Bone', '00:02:48', 0),
(26, 'Tinfoil', '00:01:11', 0),
(27, 'Until It Breaks', '00:03:43', 0),
(28, 'Victimized', '00:01:46', 0),
(29, 'We Are Young', '00:04:37', 0),
(30, 'Some Nights', '00:04:11', 0),
(31, 'Memories', '00:03:09', 1),
(32, 'Don\'t Stop Me Now', '00:03:36', 0),
(33, 'We Are The Champions', '00:03:00', 0),
(34, 'Misery', '00:03:36', 1),
(35, 'Maps', '00:03:10', 0),
(36, 'Animals', '00:03:51', 1),
(37, 'It Was Always You', '00:04:00', 1),
(38, 'Unkiss Me', '00:03:58', 1),
(39, 'Sugar', '00:03:55', 1),
(40, 'Leaving California', '00:03:23', 1),
(41, 'In Your Pocket', '00:03:39', 1),
(42, 'New Love', '00:03:16', 1),
(43, 'Coming Back For You', '00:03:47', 1),
(44, 'Feelings', '00:03:14', 1),
(45, 'My Heart Is Open', '00:03:57', 1),
(46, 'Shoot Love', '00:03:10', 1),
(47, 'Sex And Candy', '00:04:25', 1),
(48, 'Lost Stars', '00:04:27', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `songs_albums`
--

CREATE TABLE `songs_albums` (
  `song_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `songs_albums`
--

INSERT INTO `songs_albums` (`song_id`, `album_id`) VALUES
(1, 3),
(2, 3),
(3, 3),
(4, 3),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 5),
(30, 4),
(31, 6),
(32, 7),
(33, 8),
(34, 9),
(35, 10),
(36, 10),
(37, 10),
(38, 10),
(39, 10),
(40, 10),
(41, 10),
(42, 10),
(43, 10),
(44, 10),
(45, 10),
(46, 10),
(47, 10),
(48, 10);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL COMMENT 'user username',
  `email` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` varchar(1) NOT NULL,
  `admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`username`, `email`, `password`, `birth_date`, `gender`, `admin`) VALUES
('agostino', 'agostino@gmail.com', 'c822749e947ec22fdfc4a89df28681d7f174d9f1', '2000-01-30', 'M', 1),
('user', 'user@user.com', 'c822749e947ec22fdfc4a89df28681d7f174d9f1', '1989-09-14', 'M', 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `user_songs`
--

CREATE TABLE `user_songs` (
  `username` varchar(50) NOT NULL,
  `song_id` int(11) NOT NULL,
  `added` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `user_songs`
--

INSERT INTO `user_songs` (`username`, `song_id`, `added`) VALUES
('Agostino', 6, '2022-01-24'),
('Agostino', 21, '2022-01-24'),
('Agostino', 22, '2022-01-24'),
('Agostino', 23, '2022-01-24'),
('Agostino', 28, '2022-01-24');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`name`);

--
-- Indici per le tabelle `artists_albums`
--
ALTER TABLE `artists_albums`
  ADD PRIMARY KEY (`artist_name`,`album_id`),
  ADD KEY `album_id` (`album_id`);

--
-- Indici per le tabelle `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`user`,`pl_name`);

--
-- Indici per le tabelle `playlists_songs`
--
ALTER TABLE `playlists_songs`
  ADD PRIMARY KEY (`user`,`pl_name`,`song_id`),
  ADD KEY `playlists_songs_ibfk_1` (`song_id`);

--
-- Indici per le tabelle `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `songs_albums`
--
ALTER TABLE `songs_albums`
  ADD PRIMARY KEY (`song_id`,`album_id`),
  ADD KEY `album_id` (`album_id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indici per le tabelle `user_songs`
--
ALTER TABLE `user_songs`
  ADD PRIMARY KEY (`username`,`song_id`),
  ADD KEY `song_id` (`song_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `artists_albums`
--
ALTER TABLE `artists_albums`
  ADD CONSTRAINT `artists_albums_ibfk_2` FOREIGN KEY (`artist_name`) REFERENCES `artists` (`name`) ON DELETE CASCADE,
  ADD CONSTRAINT `artists_albums_ibfk_3` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `playlists_songs`
--
ALTER TABLE `playlists_songs`
  ADD CONSTRAINT `playlists_songs_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `playlists_songs_ibfk_2` FOREIGN KEY (`user`,`pl_name`) REFERENCES `playlists` (`user`, `pl_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `songs_albums`
--
ALTER TABLE `songs_albums`
  ADD CONSTRAINT `songs_albums_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `songs_albums_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `user_songs`
--
ALTER TABLE `user_songs`
  ADD CONSTRAINT `user_songs_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
