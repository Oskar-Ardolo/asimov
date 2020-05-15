-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  ven. 15 mai 2020 à 18:29
-- Version du serveur :  10.4.10-MariaDB
-- Version de PHP :  7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `asimov`
--

-- --------------------------------------------------------

--
-- Structure de la table `asimov_classes`
--

CREATE TABLE `asimov_classes` (
  `idclasse` int(11) NOT NULL,
  `nomclasse` varchar(100) NOT NULL,
  `profprincipal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `asimov_classes`
--

INSERT INTO `asimov_classes` (`idclasse`, `nomclasse`, `profprincipal`) VALUES
(1, 'Terminale', 0),
(2, 'Première', 0),
(3, 'Seconde', 0),
(4, '6ème', 0),
(5, '5ème A', 87),
(6, '4ème A', 89),
(7, 'SIO2', 0),
(8, 'COM1', 0),
(9, 'COM2', 80),
(10, 'SIO1', 0),
(11, '3ème', 70),
(12, 'CG1', 71),
(13, 'CG2', 79),
(14, '4ème B', 89);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_control`
--

CREATE TABLE `asimov_control` (
  `id` int(11) NOT NULL,
  `id_prof` int(11) NOT NULL,
  `description` varchar(30) NOT NULL,
  `coefficient` int(11) NOT NULL,
  `bareme` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `asimov_control`
--

INSERT INTO `asimov_control` (`id`, `id_prof`, `description`, `coefficient`, `bareme`, `date`) VALUES
(3, 70, 'BTS BLANC', 3, 20, '0000-00-00');

-- --------------------------------------------------------

--
-- Structure de la table `asimov_conversations`
--

CREATE TABLE `asimov_conversations` (
  `id` int(11) NOT NULL,
  `id_firstuser` int(11) NOT NULL,
  `id_seconduser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `asimov_conversations`
--

INSERT INTO `asimov_conversations` (`id`, `id_firstuser`, `id_seconduser`) VALUES
(1, 1, 13),
(2, 1, 9),
(8, 1, 68),
(11, 1, 20),
(13, 1, 69),
(14, 70, 9),
(15, 70, 1),
(16, 70, 126),
(17, 70, 62),
(18, 70, 112),
(19, 70, 19),
(20, 70, 93),
(21, 70, 34);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_dansclasse`
--

CREATE TABLE `asimov_dansclasse` (
  `iduser` int(11) NOT NULL,
  `idclasse` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `asimov_dansclasse`
--

INSERT INTO `asimov_dansclasse` (`iduser`, `idclasse`) VALUES
(2, 1),
(3, 2),
(4, 1),
(5, 2),
(6, 1),
(7, 6),
(8, 7),
(9, 7),
(10, 7),
(11, 7),
(12, 7),
(13, 7),
(14, 7),
(15, 7),
(16, 7),
(17, 7),
(18, 7),
(19, 7),
(20, 7),
(21, 7),
(22, 7),
(23, 7),
(24, 7),
(25, 7),
(26, 7),
(27, 7),
(28, 7),
(29, 7),
(30, 7),
(31, 7),
(32, 7),
(33, 4),
(34, 2),
(35, 3),
(36, 2),
(37, 5),
(38, 4),
(39, 1),
(40, 5),
(41, 4),
(42, 5),
(43, 6),
(44, 3),
(45, 8),
(46, 8),
(47, 5),
(48, 6),
(49, 4),
(50, 6),
(51, 2),
(52, 8),
(53, 6),
(54, 3),
(55, 3),
(56, 3),
(57, 8),
(58, 8),
(59, 2),
(60, 4),
(61, 1),
(62, 5),
(63, 5),
(64, 8),
(65, 1),
(66, 2),
(67, 5),
(68, 9),
(69, 9),
(70, 1),
(70, 2),
(72, 7),
(77, 3),
(81, 6),
(82, 2),
(83, 10),
(84, 10),
(85, 10),
(86, 8),
(90, 6),
(93, 2),
(94, 2),
(95, 2),
(96, 11),
(97, 11),
(98, 2),
(99, 2),
(100, 2),
(101, 2),
(102, 2),
(103, 2),
(104, 2),
(105, 2),
(106, 11),
(107, 2),
(108, 2),
(109, 2),
(110, 2),
(111, 2),
(112, 3),
(113, 3),
(114, 3),
(115, 3),
(116, 10),
(117, 11),
(118, 10),
(119, 10),
(120, 10),
(121, 11),
(122, 11),
(123, 14),
(124, 14),
(125, 1),
(126, 12);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_enseignematiere`
--

CREATE TABLE `asimov_enseignematiere` (
  `idprof` int(11) NOT NULL,
  `idmatiere` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `asimov_enseignematiere`
--

INSERT INTO `asimov_enseignematiere` (`idprof`, `idmatiere`) VALUES
(70, 4),
(70, 5),
(71, 2),
(71, 3),
(73, 5),
(78, 7),
(79, 2),
(79, 3),
(79, 4),
(87, 1),
(89, 1),
(91, 1),
(92, 2);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_etudiematiere`
--

CREATE TABLE `asimov_etudiematiere` (
  `idclasse` int(11) NOT NULL,
  `idmatiere` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `asimov_faq`
--

CREATE TABLE `asimov_faq` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `réponse` text NOT NULL,
  `target` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `asimov_matieres`
--

CREATE TABLE `asimov_matieres` (
  `id` int(11) NOT NULL,
  `nommatiere` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `asimov_matieres`
--

INSERT INTO `asimov_matieres` (`id`, `nommatiere`) VALUES
(1, 'Mathématiques'),
(2, 'Français'),
(3, 'Economie Droit Gestion'),
(4, 'SI4'),
(5, 'SI2'),
(6, 'SI1'),
(7, 'SI3'),
(8, 'Culture Générale et expression écrite'),
(9, 'Physique Chimie'),
(10, 'SI5'),
(12, 'SI6'),
(13, 'SI7');

-- --------------------------------------------------------

--
-- Structure de la table `asimov_messages`
--

CREATE TABLE `asimov_messages` (
  `id` int(11) NOT NULL,
  `idconvers` int(11) NOT NULL,
  `iduser` int(11) NOT NULL,
  `libelle` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `vu` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `asimov_messages`
--

INSERT INTO `asimov_messages` (`id`, `idconvers`, `iduser`, `libelle`, `date`, `vu`) VALUES
(181, 1, 13, 'cfdsfs', '0000-00-00', 1),
(182, 1, 1, '\'', '2020-04-14', 1),
(183, 1, 1, '\'', '2020-04-14', 1),
(184, 1, 1, 'trtt', '0000-00-00', 1),
(185, 1, 1, 'ddff', '0000-00-00', 1),
(186, 1, 1, 'sddsf', '0000-00-00', 1),
(187, 1, 1, 'ghghgh', '0000-00-00', 1),
(188, 1, 1, 'dfgfgdfg', '0000-00-00', 1),
(189, 1, 1, 'fgfhh', '0000-00-00', 1),
(190, 1, 1, 'sssss', '0000-00-00', 1),
(191, 1, 1, 'fdsdfd', '0000-00-00', 1),
(192, 1, 1, 'sdfsdsd', '0000-00-00', 1),
(193, 1, 1, 'ffff', '0000-00-00', 1),
(194, 1, 1, 'fsdffsdf', '0000-00-00', 1),
(195, 1, 1, 'gfggf', '0000-00-00', 1),
(196, 1, 1, 'fdgdfg', '0000-00-00', 1),
(197, 1, 1, 'ggfffgfsdfdfsfdsfsd', '0000-00-00', 1),
(198, 1, 1, 'fdsd', '0000-00-00', 1),
(199, 1, 1, 'sdfsdfd', '0000-00-00', 1),
(200, 1, 1, 'cvvdfv', '0000-00-00', 1),
(201, 1, 1, 'fgfdgdg', '0000-00-00', 1),
(202, 1, 1, 'hgff', '0000-00-00', 1),
(203, 1, 1, 'fhgh', '0000-00-00', 1),
(204, 1, 1, 'cvhghf', '0000-00-00', 1),
(205, 1, 1, 'nhgfvhghgfh', '0000-00-00', 1),
(206, 1, 1, 'tyytuty', '0000-00-00', 1),
(207, 1, 1, 'sdqd', '0000-00-00', 1),
(208, 1, 1, 'ddss', '0000-00-00', 1),
(209, 1, 13, 'qssdsd', '0000-00-00', 1),
(210, 1, 13, 'qssdsd', '0000-00-00', 1),
(211, 1, 1, 'non', '0000-00-00', 1),
(212, 1, 1, 'cgf', '0000-00-00', 1),
(213, 1, 13, 'je t\'aime', '0000-00-00', 1),
(214, 1, 13, 'je t\'aime', '0000-00-00', 1),
(215, 1, 13, 'INSERT INTO asimov_messages (id, idconvers, iduser, libelle, date) VALUES (NULL, \'1\', \'13\', `je t\'aime`, date)', '0000-00-00', 1),
(216, 1, 13, 'je t\'aime', '0000-00-00', 1),
(217, 2, 1, 'hello world', '0000-00-00', 0),
(219, 2, 9, 'hello bg', '0000-00-00', 1),
(221, 1, 1, 'dvdfdf', '0000-00-00', 1),
(222, 1, 1, 'sdfsdfsdfd', '0000-00-00', 1),
(223, 1, 1, 'ggdgdf', '0000-00-00', 1),
(224, 1, 1, 'gdfgdf', '0000-00-00', 1),
(225, 1, 1, 'bbvb', '0000-00-00', 1),
(227, 2, 1, 'gfdfgdfg', '0000-00-00', 0),
(228, 1, 1, 'wsh', '0000-00-00', 1),
(229, 1, 1, 'mange ta mère', '0000-00-00', 1),
(230, 1, 1, 'WSH', '0000-00-00', 1),
(231, 1, 1, 'BG', '0000-00-00', 1),
(232, 1, 1, 'DSF', '0000-00-00', 1),
(233, 1, 13, 'DFDDF', '0000-00-00', 1),
(234, 1, 13, 'je t\'aime', '0000-00-00', 1),
(235, 1, 13, 'suce', '0000-00-00', 1),
(236, 1, 13, 'hello', '0000-00-00', 1),
(237, 1, 13, 'je t\'aime', '0000-00-00', 1),
(238, 1, 13, 'ntm', '0000-00-00', 1),
(239, 1, 1, 'jvais t\'éclater', '0000-00-00', 1),
(240, 1, 1, '????', '0000-00-00', 1),
(241, 1, 1, 'bg', '0000-00-00', 1),
(242, 1, 13, 'eh', '0000-00-00', 1),
(243, 1, 1, 'oh', '0000-00-00', 1),
(244, 1, 13, 'je t\'aime', '0000-00-00', 1),
(245, 1, 13, 'hello', '0000-00-00', 1),
(246, 1, 13, 'qssdsd', '0000-00-00', 1),
(247, 1, 13, 'je t\'aime', '0000-00-00', 1),
(248, 1, 13, 'hello', '0000-00-00', 1),
(249, 2, 1, 'ntm', '0000-00-00', 0),
(250, 2, 1, 'hey', '0000-00-00', 0),
(251, 1, 13, 'salut', '0000-00-00', 1),
(252, 1, 1, 'gfhfdg', '0000-00-00', 1),
(253, 1, 13, 'je t\'aime', '0000-00-00', 1),
(254, 1, 13, 'qssdsd', '0000-00-00', 1),
(255, 1, 1, 'mange tes mort', '0000-00-00', 1),
(256, 2, 1, 'fdp', '0000-00-00', 0),
(257, 2, 1, 'jhghjgjhgjh', '0000-00-00', 0),
(258, 1, 1, 'wsh', '0000-00-00', 1),
(259, 2, 1, 'hein?', '0000-00-00', 0),
(260, 1, 1, 'bg', '0000-00-00', 1),
(261, 2, 1, 'bg', '0000-00-00', 0),
(262, 2, 1, 'hello', '0000-00-00', 0),
(263, 1, 1, 'ntm', '0000-00-00', 1),
(264, 1, 1, 'je', '0000-00-00', 1),
(265, 1, 1, 'te', '0000-00-00', 1),
(266, 1, 13, 'quoi', '0000-00-00', 1),
(267, 1, 1, 'feur', '0000-00-00', 1),
(268, 1, 1, 'rien', '0000-00-00', 1),
(269, 1, 13, 'fuck', '0000-00-00', 1),
(270, 1, 1, 'mange', '0000-00-00', 1),
(271, 1, 13, 'ta mère', '0000-00-00', 1),
(272, 1, 13, 'hey mec', '0000-00-00', 1),
(273, 1, 1, 'oui', '0000-00-00', 1),
(274, 1, 13, 'rien enft', '0000-00-00', 1),
(275, 1, 1, 'oki', '0000-00-00', 1),
(276, 1, 1, 'oki', '0000-00-00', 1),
(277, 1, 1, 'oki', '0000-00-00', 1),
(278, 1, 1, 'oki', '0000-00-00', 1),
(279, 1, 1, 'oki', '0000-00-00', 1),
(280, 1, 1, 'non', '0000-00-00', 1),
(281, 1, 1, 'oui', '0000-00-00', 1),
(282, 1, 1, 'non', '0000-00-00', 1),
(283, 1, 1, 'bril', '0000-00-00', 1),
(284, 1, 13, 'nul ta blague', '0000-00-00', 1),
(285, 1, 13, 'qssdsd', '0000-00-00', 1),
(286, 1, 13, 'mec', '0000-00-00', 1),
(287, 1, 13, 'ca marche', '0000-00-00', 1),
(288, 1, 13, 'qseerert', '0000-00-00', 1),
(289, 1, 13, 'c\'est bon', '0000-00-00', 1),
(290, 1, 13, 'hello', '0000-00-00', 1),
(291, 1, 13, 'je t\'aime', '0000-00-00', 1),
(292, 1, 13, '', '0000-00-00', 1),
(293, 1, 13, '01234567890123456789012345', '0000-00-00', 1),
(294, 1, 13, 'qssdsd', '0000-00-00', 1),
(295, 1, 13, 'hello', '0000-00-00', 1),
(296, 1, 13, '11111111111111111111111111111', '0000-00-00', 1),
(297, 1, 13, '11111111111111111111111111111', '0000-00-00', 1),
(298, 1, 13, 'fdfd', '0000-00-00', 1),
(299, 1, 13, 'gfh', '0000-00-00', 1),
(300, 1, 13, 'gggfd', '0000-00-00', 1),
(301, 1, 13, 'je t\'aime', '0000-00-00', 1),
(302, 1, 13, 'je t\'aime', '0000-00-00', 1),
(303, 8, 1, 'hey bg', '0000-00-00', 0),
(304, 8, 1, 'hey bg', '0000-00-00', 0),
(306, 11, 1, 'wsh mon gars', '0000-00-00', 1),
(307, 11, 1, 'hey bg', '0000-00-00', 1),
(308, 11, 1, 'wsh', '0000-00-00', 1),
(309, 11, 1, 'wtf', '0000-00-00', 1),
(310, 11, 1, 'f', '0000-00-00', 1),
(311, 11, 1, 'f', '0000-00-00', 1),
(312, 11, 20, 'ntm', '0000-00-00', 1),
(313, 13, 1, 'wsh', '0000-00-00', 0),
(314, 2, 1, 'je t\'encule', '0000-00-00', 0),
(315, 2, 1, 'wsh', '0000-00-00', 0),
(316, 2, 1, 'wsh', '0000-00-00', 0),
(317, 2, 1, 'hey', '0000-00-00', 0),
(318, 13, 1, 'slt', '0000-00-00', 0),
(319, 14, 70, 'hey petite salope', '0000-00-00', 0),
(322, 15, 70, 'slt', '0000-00-00', 0),
(323, 16, 70, 'slt', '0000-00-00', 0),
(324, 17, 70, 'wsh', '0000-00-00', 0),
(325, 18, 70, 'hello', '0000-00-00', 0),
(326, 19, 70, 'dd', '0000-00-00', 0),
(327, 20, 70, 'ssss', '0000-00-00', 0),
(328, 21, 70, 'slt', '0000-00-00', 0),
(329, 21, 70, 'sv', '0000-00-00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_notes`
--

CREATE TABLE `asimov_notes` (
  `id` int(11) NOT NULL,
  `note` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_ds` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `asimov_notes`
--

INSERT INTO `asimov_notes` (`id`, `note`, `id_user`, `id_ds`) VALUES
(6, 2, 39, 3),
(7, 6, 65, 3),
(8, 3, 2, 3),
(9, 6, 6, 3),
(10, 11, 4, 3),
(11, 13, 61, 3),
(12, 15, 125, 3);

-- --------------------------------------------------------

--
-- Structure de la table `asimov_users`
--

CREATE TABLE `asimov_users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `pseudo` varchar(15) NOT NULL,
  `password` text NOT NULL,
  `rang` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `asimov_users`
--

INSERT INTO `asimov_users` (`id`, `nom`, `prenom`, `pseudo`, `password`, `rang`, `titre`) VALUES
(1, 'OLDFIELD', 'Graham', 'oldfieldgraham', 'c0ddfc2c069dc2aa7984483fa2e4527e1cab19e8614f5022cb0e9d4eb004ea12', 10, 'Président'),
(2, 'ROUILLARD', 'Vincent', 'rouillavi', '1af515cbcd58e218a043846d9772871c6373c42a58e9880776a997db09ad39f7', 1, 'Élève'),
(3, 'MELTZ', 'Nicolas', 'meltzni', '1af515cbcd58e218a043846d9772871c6373c42a58e9880776a997db09ad39f7', 1, 'Élève'),
(4, 'LABROSSE', 'Adam', 'labrossad', '1af515cbcd58e218a043846d9772871c6373c42a58e9880776a997db09ad39f7', 1, 'Élève'),
(5, 'NOUHIX', 'Eva', 'nouhixeva', '1af515cbcd58e218a043846d9772871c6373c42a58e9880776a997db09ad39f7', 1, 'Élève'),
(6, 'MARYNX', 'Charlotte', 'marynxch', '1af515cbcd58e218a043846d9772871c6373c42a58e9880776a997db09ad39f7', 1, 'Élève'),
(7, 'KARABISTOUY', 'Bricole', 'karabisbr', 'a5ecba36cdd1c6dc64e9013138d668d6a400b99df295ddcf67e5f9bb7398fccd', 1, 'Élève'),
(8, 'PETIT', 'Yanis', 'petitya', 'fbd7107f2913d668fa22a41910cd68eb3f99c259a4187f6b64b4708e8028641d', 1, 'Élève'),
(9, 'FONTANA', 'Enzo', 'fontanaen', 'd9c9103dc0dcf62253789a037047b64efb5431255bad7535048b034007538ec4', 1, 'Élève'),
(10, 'CATINELLA', 'Benjamin', 'catinelbe', '0a1ec446e7b53119d20d2fcf288b9955ac9b79ca54192aaab6cf64d4153ee01c', 1, 'Élève'),
(11, 'MURIENNE', 'Hugo', 'muriennhu', '13b765d66aa5697d161cfd4af6ea0135e479ee9f41f1282c92642e7cee9dfe24', 1, 'Élève'),
(12, 'GIRY', 'Lucas', 'girylu', '7bec8b2664b67accdf97dbdcd6c6381209371850af6aa1852a712d33f36cac29', 1, 'Élève'),
(13, 'AYED', 'Merwann', 'ayedme', '8fda22eec5c1fec6cc28601147c869076618b533c8aff75ed036fc2392252cc5', 1, 'Élève'),
(14, 'MOREL', 'Matteo', 'morelma', 'c9d0359d3ddc808d04f9829019741963f9cfecc99726a25ab25e344ef756dbc9', 1, 'Élève'),
(15, 'MOUTON', 'Teddy', 'moutonte', '2bef8d1d495534880e00dd14347d85ca2bbfa9a80e25784fcea6631c2bd0ed08', 1, 'Élève'),
(16, 'ROSSET', 'Etienne', 'rossetet', '86846cdbae70936690888b50eef8eb4e02031519589bbc2d9a3bd03f21b53eff', 1, 'Élève'),
(17, 'ROBAIL', 'Ossama', 'robailos', '928d84d889d8c6799fd5e1c722b5ee16d7543827bd6add340df33f9b128849b4', 1, 'Élève'),
(18, 'DERIN', 'Ahmet', 'derinah', 'd8e76787b977294c11c20f5a61f865604789e78d93dcaf664fb108a6d271e267', 1, 'Élève'),
(19, 'ARMAND', 'Léo', 'armandlé', '44f7d74eb1612bea35f08e9225a7bb2b78c193906d80cf139026708094f5f332', 1, 'Élève'),
(20, 'AZIZI', 'Kaïs', 'azizika', '11bea118e1c554eb28d653a5d2df12bb37f1d3200f4f6af6788c2e7442f1e676', 1, 'Élève'),
(21, 'BARBOSSA', 'Alix', 'barbossal', 'ad558ab0d3c1f187156eb3f79316f808ea4a26529bb202a3001fed96a84d6153', 1, 'Élève'),
(22, 'BERNIER', 'Enzo', 'bernieren', '506b558f5db70a51b54adb270bc3f8342f82347ae0cd8cc5ce3a009f5c988299', 1, 'Élève'),
(23, 'BOULANGER', 'Philippe', 'boulangph', 'c931b0c50719eb4e185015c2d6a29856028486147ddc7801270ecfc0c0754b87', 1, 'Élève'),
(24, 'BRAJON', 'Bastien', 'brajonba', '43160c381319832c00455ef8684f2374e4f5056424e02de6d16098c039ac4574', 1, 'Élève'),
(25, 'CHAALANE', 'Noam', 'chaalanno', '4f03fd7675b8075d1f5a5331d7b922a4f7034dc610b1fbeb0f48a7875823f95f', 1, 'Élève'),
(26, 'DO LAGO', 'Nicolas', 'dolagoni', '07b7715121f50b5bc3dc8c40b6a9c9bae49b508fda2e80c3aa6d237405323734', 1, 'Élève'),
(27, 'FAZIO', 'Salvatore', 'faziosa', 'ba0f85668d60c5f84e21b84768065aa025b0fd549c94ffdc196ed695e1ec4367', 1, 'Élève'),
(28, 'GAVILLOT', 'Jolan', 'gavillojo', 'dadcb9f4a5d2d5d45820bf08ae19dd7a843f99ce70a5b5b5791e0af70ac42450', 1, 'Élève'),
(29, 'GINIER', 'Maxime', 'ginierma', '48e71a692cd77d4519a616073cc20f47b0ce05f24853233a1dddf1fec895f8fb', 1, 'Élève'),
(30, 'HANOTEL', 'Nicolas', 'hanotelni', '18a3d151a0f13ff989913f9e5882a4931fcda738b85f7459469f53b0e40c600f', 1, 'Élève'),
(31, 'HOSTACHY', 'Florian', 'hostachfl', 'ea09e892a835b3225ab1f36be2e458a9cdd0a9b764df679dd2845a036d887d28', 1, 'Élève'),
(32, 'LEFEBVRE', 'Théo', 'lefebvrth', '25235a36891aa4a3dc1dff887216ac6484dbbd3198663aa3f724ec5030db8710', 1, 'Élève'),
(33, 'ALLON', 'Levy', 'allonle', 'd1b87fbaece2f5cff43824492f3bd3165624d982385c51f985dd165a53090b6a', 1, 'Élève'),
(34, 'BACARD', 'Hugo', 'bacardhu', 'f0d04cc0f533c8724913abf92b67a1112a5802b3fda7341fef15772e60cf5283', 1, 'Élève'),
(35, 'BERKOVITCH', 'Vladimir', 'berkovivl', 'f22b3ee8f250ed009c97fee99ef632b9d5f814ec315804d7764dd47a377a0bbd', 1, 'Élève'),
(36, 'SCHUBERT', 'Alice', 'schuberal', '2a64d3d67b06538467a0c23934477e13f988ba6ffa7e61b7ad9bfac5a83930f5', 1, 'Élève'),
(37, 'BAKER', 'Matthew', 'bakerma', '21a897e4f53d7d693493286c9c1351f28a45190a446ae131d3ba205217a73206', 1, 'Élève'),
(38, 'BALWE', 'Chetan', 'balwech', '4873cb14831fca600a7f5ca59889ce7f40d92cf59822a499eb2a7ac9ed96ad6a', 1, 'Élève'),
(39, 'BOUSCAREN', 'Elisabeth', 'bouscarel', '1bc49702274e17a93f791a30e218f9925bf9e68b3de1c9c4507c3da2d0272e42', 1, 'Élève'),
(40, 'CEBALLOS', 'Cesar', 'ceballoce', 'ac0162d92ac3dc26cf0929ab4839655e3114f7446d5b6452ffa5b3cf9f74f16e', 1, 'Élève'),
(41, 'CHEN', 'Miaofen', 'chenmi', '86bce60cfdb38b6f67e6d6b5ae6d383e99db6ce1636cca04e0554965a33b7177', 1, 'Élève'),
(42, 'CHEN', 'Ke', 'chenke', 'b668d5ba408cc9c212f15be48f41270ea34f76a88b74a6a20955d280d05c46e1', 1, 'Élève'),
(43, 'CHEN', 'Lao', 'chenla', '172aa5b9c1c7e2e086e3123b2b3641fde952a92e4f375222e634149027d9c32a', 1, 'Élève'),
(44, 'DO CASIO', 'Larry', 'docasila', '73bac90ba221364ae716215b5e97c1782e67e31c56070e761c1ba6c7cc0e3074', 1, 'Élève'),
(45, 'BYRON', 'Dylan', 'byrondy', '179f8cb8c4ffb1f9d76005c293ed4d0f57687910a50a7b3bad7cc82621dc0131', 1, 'Élève'),
(46, 'BRASCA', 'Riccardo', 'brascari', 'c0ab40dbdd306069836adef923ac56501b53a26c9b2c88e86657cd3f43e550d5', 1, 'Élève'),
(47, 'BLOSSIER', 'Thomas', 'blossieth', 'bfa52a233be3cb1cbf8861e21074dda30653afa84510dd475de265e2f9387900', 1, 'Élève'),
(48, 'CHRISTIE', 'Aron', 'christiar', '24e24dd87c1dba5be3dd65295498f4d472b8aef3b2831aad093777524be421c2', 1, 'Élève'),
(49, 'CUETO', 'Malir', 'cuetoma', 'bc8008b837b04174f0b275526f83aa229f3e80e6ba21d656a3e7ec213210aea4', 1, 'Élève'),
(50, 'CUNINGHAM', 'Clifton', 'cuninghcl', '97965ed11181d86badeeea2085dba5cce126cfc2b950bf77317735f32144e5ba', 1, 'Élève'),
(51, 'AADJIN', 'Moha', 'aadjinmo', 'f4050d84afb841c63d8c748a14f62662889c4431c2b8d6467568b04584ce6cca', 1, 'Élève'),
(52, 'ARLIN', 'Harley', 'arlinha', '3b4078f2db7f72297c0782b97775271938117f851849d91725d3d0be27c57e6a', 1, 'Élève'),
(53, 'ASSITO', 'Mario', 'assitoma', '6a5a0724515d92c9633556f70a661b1ca2c89bf6e04791ec4c7be26efad06f7a', 1, 'Élève'),
(54, 'ERIKSON', 'Denis', 'eriksonde', 'e31699c8bc813ae46800d0a5955d330f54808356eebe8dbf5aed192ebeeb6eb1', 1, 'Élève'),
(55, 'FARANG-HARIRI', 'Banafsheh', 'farangba', '3909f75636972d0b10236005fdde06008ddbae117f4463e8b288bae4280a0954', 1, 'Élève'),
(56, 'FAVRE', 'Charles', 'favrech', 'e80350fe683b239c9fa7f570e39987885adce0e9976c5ed28ffbe58d695fd87a', 1, 'Élève'),
(57, 'FEHM', 'Arno', 'fehmar', 'd29b537c0ce5357b40eab34cb780cce156cfd32b2056bb6d12cebd2b3e8c31c5', 1, 'Élève'),
(58, 'GARAY-LOPEZ', 'Christian', 'garaylch', '5101d9c18beb35479e6d834fd766d9e660597a3b7414ce3f0d27272468c995b3', 1, 'Élève'),
(59, 'GONZALES', 'Pedro', 'gonzalepe', '44dbe3d0c91fd5fec7c042b72df50cec6256edff28f6997b85e3551818ed057c', 1, 'Élève'),
(60, 'HENNIART', 'Guy', 'henniargu', 'a655466976815a6efac578b8fe4b7c79a7dd7cfd534c5ea9d7d264b222414c80', 1, 'Élève'),
(61, 'KAMENSKY', 'Moshe', 'kamenskmo', 'dd5683cbb5c36a9d3135f9190eba0d915860010bb4b6ef9afce3a71a0273cc82', 1, 'Élève'),
(62, 'AARON', 'Greta', 'aarongr', '825165cffabbed9f2a6d1304738bf5a36a9ba7c3bb7356bf087ff233dc25c20f', 1, 'Élève'),
(63, 'KIWI ', 'Jan', 'kiwija', '6bb81a0118dc4f352d0ae87956c67b3c0a001f70a2f6e58fb6168739db56e89f', 1, 'Élève'),
(64, 'LANG', 'Lionel', 'langli', '5c6ac9280e0adb3100ae1a193bba0fb022464fb62bcbf46bbdbfbc52f778bc1e', 1, 'Élève'),
(65, 'LEMOINE', 'Thibaut', 'lemoineth', '28f51d7fdcf98c380c7801ac7d3dc0445acbd735d707f1f7624bece01063b438', 1, 'Élève'),
(66, 'LOESER', 'Francois', 'loeserfr', '5fdaee3721ec15473ff45ede2bbc2b2f8219dab2aa377ca86416689bb04258c2', 1, 'Élève'),
(67, 'MANTOVAN', 'Elena', 'mantovael', '93619f89a4af5d3396b0d5aa9f6ff1f8ad70195b8f814e94879bdbe196e9acdd', 1, 'Élève'),
(68, 'MELTZ', 'Gregory', 'meltzgr', '63012bef9000e1e2353625b9f9471a62dc6ba100a19d1cebd043a451d1fe0fd6', 1, 'Élève'),
(69, 'AADJIN', 'AHMED', 'aadjinah', 'ef282085bce21a738c9d74bdff45b5c8318d510b9693ba9747a39f6b847072a3', 1, 'Élève'),
(70, 'ROUMANET', 'David', 'roumaneda', '5f0830d7d3f9988caab6af5f341dc15062e1c8945d0d0e528bad6bec1abbf3e9', 5, 'Professeur'),
(71, 'DAVID', 'Maxime', 'davidma', '34e1c8748b1aefd958f6b31d091269ec17c97239fd4142f42d8ce7d431e4e564', 5, 'Professeur'),
(72, 'JOJO', 'Fag', 'jojofa', 'a43f20587403d4fd44adb9d333770f47f381bddb2fbc261cb106b886e5f848e3', 1, 'Élève'),
(73, 'DESVIGNES', 'Pierre', 'desvignpi', 'a03ad5f0b3b4ce4309cc783276e9d0038d613b1d13df9859c620e7a6c40edf0c', 5, 'Professeur'),
(77, 'OAK', 'Martin', 'oakma', '6de0064e12c3ba0789e6c53e5c42975ee342331fa891119d87d9b86066f0e8ac', 1, 'Élève'),
(78, 'LAGACHE', 'Francois', 'lagachefr', '27fdcffff59f7e8c8010c3bbf1f686da7b655f066e4229e39345485478b033d2', 5, 'Professeur'),
(79, 'DUPONT', 'Pierre', 'dupontpi', '1d0c8cf6acbec272f3fa716a755d0d8c3df980ec00e839976364e3f531bf7d69', 5, 'Professeur'),
(80, 'SAPRISTI', 'Martin', 'sapristma', 'd1d40f7544b9d37c1764f9e081a89b4c1afa9e0e3f15b092cf494102c8ce22d5', 5, 'Professeur'),
(81, 'LAUPOK', 'Armand', 'laupokar', 'b4b83817379d08cbfb2134fad3ab19780be2bd0f00151aa0c25c1bf81cb271d9', 1, 'Élève'),
(82, 'MEDIDONK', 'Cekoisa', 'medidonce', 'de222b06ef2c3f6c85866a81bbb5eab86971f24ba3f8fb8042eb503cc095a11a', 1, 'Élève'),
(83, 'MARAMÉ', 'Choké', 'maraméch', 'e25f1052cc66b369cd0856bc3e448b6048ce2f3010c4323c3d108fd829d237e1', 1, 'Élève'),
(84, 'MÉCHOUI', 'Depor', 'méchouide', '660269bf13b7afa9efdb0e74632bd39b97d5caffb2718bfc86278b606c35f8ae', 1, 'Élève'),
(85, 'DJIBOU', 'Tigro', 'djibouti', '270cf03fc4a43c80ae80571b2ecdd00b5a6771754a8ded0565c97c260e852404', 1, 'Élève'),
(86, 'THUNBERG', 'Greta', 'thunbergr', '49cbdba6e73202ef663ad59d5ab815b76fbea76372855d23d70971595d85d416', 1, 'Élève'),
(87, 'MANSOURI', 'Aymeric', 'mansouray', '9ccb7ec2fca360863a097d417b9eef430f40eadf20754d9b547e614a9099ca1f', 5, 'Professeur'),
(88, 'TRUAND', 'Morsay', 'truandmo', '45b7584801447ad339d047e1ea52c0b3824549e2a1ab44e216af2ab908ee0889', 5, 'Professeur'),
(89, 'IMBERT', 'Michel', 'imbertmi', '18456d8b41f57fdd63562b835b7aca2a25cff1e2c4ffe5d077df2a73b8c70b07', 5, 'Professeur'),
(90, 'IMBERT', 'Charlotte', 'imbertch', 'bca9bad54ae65934fa41204f7e13bb3f045a6f078ba917ff394d9ee2b6153e46', 1, 'Élève'),
(91, 'GROPOR', 'Legro', 'groporle', '9b4dd2dfa1a15d97c95eafcb4ed41ffede731edab40db1958ad046dae3938d9f', 5, 'Professeur'),
(92, 'BOVAGNET', 'Brigitte', 'bovagnebr', 'bf20893c6c68335094dd5f3dc342574e14ff9418bed027510401da35651759f9', 5, 'Professeur'),
(93, 'AMORE', 'Solene', 'amoreso', 'ae19a88c734b0b83c3d739af4e0cfd176463c18d208f94e05e68bc6ba58c3083', 1, 'Élève'),
(94, 'BIANCHIN', 'Axel', 'bianchiax', '95a4d1cdb8d932539dde2d7d866755abce2c124badef7b34fa2778e316330597', 1, 'Élève'),
(95, 'GIRAULT', 'Jeanne', 'giraultje', 'e0992f5d963500629469ce39d7b51bb036f099d5918a9190066bd1f0708cf53c', 1, 'Élève'),
(96, 'MAILLY', 'Lucy', 'mailllu', '8fe664b22990a37c7daa9f5100e1f9ee1a1f90aba21a355605d27b4bc29d328a', 1, 'Élève'),
(97, 'MAILY', 'Lucy', 'mailylu', '2089225fb507f6babb9c06d5b530c7603b0526b25b2bd131a445df5856c7be28', 1, 'Élève'),
(98, 'MANOUKOVA', 'Larissa', 'manoukola', 'a6111f138ff94c2ea00111def606bd6b74ac36b0ae64faea14b5e6980851b1c0', 1, 'Élève'),
(99, 'PORTE', 'Kelvin', 'porteke', 'ddb94418cf92f62b03898e713518baac08663398829839ccef6d28ad7a5aaa51', 1, 'Élève'),
(100, 'MIC', 'Eva', 'micev', 'b99e6dcabe81746339a55a32b90116ea77a573ac03c9bbdd1d98adaefd9a4e57', 1, 'Élève'),
(101, 'COURA', 'Alexia', 'couraal', '60f358e084868dc525fbdfe14dd5a2862f37dabd06dc5fd4d921ca579a0c0e6e', 1, 'Élève'),
(102, 'LAUZIER', 'Celia', 'lauzierce', '8556ca64b602083bf2097b8c72b8a184ac21619e15275b0fe62c3bb919cec15d', 1, 'Élève'),
(103, 'JACHOWSKI', 'Paul', 'jachowspa', '3dccf9a209806b396fff7fe31ff5ded2e6f23337d0b1afd05ab378227bfc5a42', 1, 'Élève'),
(104, 'TRIBOULAT', 'Anaïs', 'triboulan', '2b9b79c332f619ba798d0dc00028318eea5532ba340703e14f2fb0d22b84cb69', 1, 'Élève'),
(105, 'SERRANO', 'Giovanna', 'serranogi', 'f998a638ed9c967cb706e6ec497e6a36854b28ef765c194fd5359c7dbda40171', 1, 'Élève'),
(106, 'JOSEPH', 'Joeystar', 'josephjo', 'fd8e64ee4e63ee55d52ad1d2f7d55c76ac2201a9719e3483afcd5db62e62434e', 1, 'Élève'),
(107, 'GIORNO', 'Giovanna', 'giornogi', '7cfee4866f24d2082c0ecce8383f2bb98fa26aa7cd91754268fb6c4b099f2be4', 1, 'Élève'),
(108, 'RIETHMULLER', 'Solene', 'riethmuso', '836e576c8d4de650d3d30675309bb80c4217512d47cbed406867cf753422abbc', 1, 'Élève'),
(109, 'SIGALAS', 'Noée', 'sigalasno', '45ca8da676cb872d79f5f133d2a995dc29101c3ad58f1bc12edb28b30eff25ba', 1, 'Élève'),
(110, 'DEMEURES', 'Jules', 'demeureju', 'd9235c5ef658fd97a699363aae17f70072643f741e09291ab5e7e3b48a88a72f', 1, 'Élève'),
(111, 'FAZIO', 'Fiona', 'faziofi', '76a1f8501075d6b1dbc6609afcf2a2cfaffdced4a45471db060d9e07dd3a8d4a', 1, 'Élève'),
(112, 'DERBEZ', 'Fanny', 'derbezfa', '0d899c03146593cbeeb14ecc6c25b1715304f31e5e7ef60b0dd3d56b73554f74', 1, 'Élève'),
(113, 'CLERMONT', 'Yanis', 'clermonya', '4194bcf309647e3e29d018bd69061a859b7de9f020f322e36228c1af1375f40d', 1, 'Élève'),
(114, 'BOUTAHAR', 'Walid', 'boutahawa', '2b4947e886329beb31aca7cea8057d3232eb7f75a9b85f246e8475fec6ae41e9', 1, 'Élève'),
(115, 'ROMERA', 'Raphael', 'romerara', '1d21b195cbe901ea16663a5293a81097f891d85f52af6a36f2e99927a226863f', 1, 'Élève'),
(116, 'GEPLU', 'Didée', 'gepludi', '41ec468730879746e6e409ca683b4d436c852cd3624375de61d673db99e2925a', 1, 'Élève'),
(117, 'GROTEST', 'Challahcamarche', 'grotestch', '87f6205a44e53e7b92d2495be305ed43aa40e75ffab913e03e98fffe8a9f9fb4', 1, 'Élève'),
(118, 'OBITUARY', 'Katel', 'obituarka', 'cbfaa726f992981a390e34fe9812be55707b253eceddcd6a0a55b4520154d5ca', 1, 'Élève'),
(119, 'CEKOI', 'Alexis', 'cekoial', '456c757f1aa5502fe99bdf155011c3c818b1bf6a840f3caf6285d340d6130655', 1, 'Élève'),
(120, 'ZAHNER', 'Antoine', 'zahneran', '70fa09075af9e73360b487a256393adda7b1af99dd87db46770104cef5ee02ce', 1, 'Élève'),
(121, 'DDDCDCD', 'Cdcdcddcdc', 'dddcdcdcd', '69480cb7c7dc0de8997841ff64ba56525aff61937bdd3f4af574abd32a3d9aff', 1, 'Élève'),
(122, 'NETADJ', 'Ali', 'netadjal', '06663b1e7b9c98bde066920d4f03f4594b5fc10be5d8ad5a4abc4253cb6c64b8', 1, 'Élève'),
(123, 'KARABISTOUILLE', 'Enzo', 'karabisen', '867e6a5811fc20c51adbe87648f738b91e96ee25b241bc3c35e738cd0803b226', 1, 'Élève'),
(124, 'GENÉMAR', 'Decettemerde', 'genémarde', 'bd60ddb04a878f62b96fa367a2b85c9754999ab13a79c699def93e8ebedbbc2e', 1, 'Élève'),
(125, 'FINCK', 'Jules', 'finckju', 'a935158abb2db736b17be7ba3cbd07f8759b78039be6a0f001cb33a8fb920dbc', 1, 'Élève'),
(126, 'ALEXIS', 'Nieto', 'alexisni', 'd8a6c42d553489591592129e190650a4098c5e1e60a6d867ec29f45989f688b1', 1, 'Élève');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `asimov_classes`
--
ALTER TABLE `asimov_classes`
  ADD PRIMARY KEY (`idclasse`);

--
-- Index pour la table `asimov_control`
--
ALTER TABLE `asimov_control`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `asimov_conversations`
--
ALTER TABLE `asimov_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pseudo_second` (`id_seconduser`),
  ADD KEY `pseudo_first` (`id_firstuser`) USING BTREE;

--
-- Index pour la table `asimov_dansclasse`
--
ALTER TABLE `asimov_dansclasse`
  ADD PRIMARY KEY (`iduser`,`idclasse`);

--
-- Index pour la table `asimov_enseignematiere`
--
ALTER TABLE `asimov_enseignematiere`
  ADD PRIMARY KEY (`idprof`,`idmatiere`);

--
-- Index pour la table `asimov_etudiematiere`
--
ALTER TABLE `asimov_etudiematiere`
  ADD PRIMARY KEY (`idclasse`,`idmatiere`);

--
-- Index pour la table `asimov_faq`
--
ALTER TABLE `asimov_faq`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `asimov_matieres`
--
ALTER TABLE `asimov_matieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `asimov_messages`
--
ALTER TABLE `asimov_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idconvers` (`idconvers`);

--
-- Index pour la table `asimov_notes`
--
ALTER TABLE `asimov_notes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `asimov_users`
--
ALTER TABLE `asimov_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `asimov_classes`
--
ALTER TABLE `asimov_classes`
  MODIFY `idclasse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `asimov_control`
--
ALTER TABLE `asimov_control`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `asimov_conversations`
--
ALTER TABLE `asimov_conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `asimov_faq`
--
ALTER TABLE `asimov_faq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `asimov_matieres`
--
ALTER TABLE `asimov_matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `asimov_messages`
--
ALTER TABLE `asimov_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=330;

--
-- AUTO_INCREMENT pour la table `asimov_notes`
--
ALTER TABLE `asimov_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `asimov_users`
--
ALTER TABLE `asimov_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `asimov_conversations`
--
ALTER TABLE `asimov_conversations`
  ADD CONSTRAINT `asimov_conversations_ibfk_1` FOREIGN KEY (`id_firstuser`) REFERENCES `asimov_users` (`id`),
  ADD CONSTRAINT `asimov_conversations_ibfk_2` FOREIGN KEY (`id_seconduser`) REFERENCES `asimov_users` (`id`);

--
-- Contraintes pour la table `asimov_messages`
--
ALTER TABLE `asimov_messages`
  ADD CONSTRAINT `asimov_messages_ibfk_1` FOREIGN KEY (`idconvers`) REFERENCES `asimov_conversations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
