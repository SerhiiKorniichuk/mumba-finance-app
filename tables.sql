/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `configs`;

CREATE TABLE `configs` (
  `hash` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `data` text NOT NULL,
  PRIMARY KEY (`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `logs`;

CREATE TABLE `logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `actionType` int(11) NOT NULL,
  `actionComment` varchar(1000) NOT NULL,
  `ipAddress` varchar(100) NOT NULL DEFAULT '',
  `date` int(11) NOT NULL,
  `browser` varchar(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`,`actionType`),
  KEY `actionType` (`actionType`,`date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `pages`;

CREATE TABLE `pages` (
  `hash` varchar(32) NOT NULL DEFAULT '',
  `pageUrl` varchar(200) NOT NULL DEFAULT '',
  `title` varchar(200) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `metaTitle` varchar(200) NOT NULL DEFAULT '',
  `metaDescription` varchar(200) NOT NULL DEFAULT '',
  `metaKeywords` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinDate` int(11) NOT NULL,
  `photo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastVisit` int(11) NOT NULL,
  `sex` int(1) NOT NULL DEFAULT '0',
  `deactivated` int(1) NOT NULL DEFAULT '0',
  `bday` int(11) NOT NULL DEFAULT '0',
  `bmonth` int(11) NOT NULL DEFAULT '0',
  `byear` int(11) NOT NULL DEFAULT '0',
  `hash` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` int(11) NOT NULL DEFAULT '0',
  `joinIp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `isVerified` int(1) NOT NULL DEFAULT '0',
  `authenticator` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `notifyIncoming` int(1) NOT NULL DEFAULT '1',
  `notifyNews` int(1) NOT NULL DEFAULT '1',
  `country` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `lastVisitIp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `banDate` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`),
  KEY `email` (`email`),
  KEY `phone` (`phone`),
  KEY `username` (`username`),
  KEY `last_visit` (`lastVisit`),
  KEY `hash` (`hash`),
  KEY `joinDate` (`joinDate`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;




DROP TABLE IF EXISTS `validation`;

CREATE TABLE `validation` (
  `type` int(2) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `item` varchar(100) NOT NULL DEFAULT '',
  `meta` text NOT NULL,
  PRIMARY KEY (`type`,`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `verification`;

CREATE TABLE `verification` (
  `userId` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `photos` text NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
