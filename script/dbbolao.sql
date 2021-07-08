CREATE DATABASE  IF NOT EXISTS `dbbolao` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbbolao`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: dbbolao
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `competition`
--

DROP TABLE IF EXISTS `competition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `active` tinyint NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competition`
--

LOCK TABLES `competition` WRITE;
/*!40000 ALTER TABLE `competition` DISABLE KEYS */;
INSERT INTO `competition` VALUES (16,'Copa 1','images/upload_18f5e7bb79806fd13752449a7cb5caf9',0,'2021-07-01 00:00:00','2021-07-30 00:00:00',26,'2021-07-06 14:01:40',46,'2021-07-06 16:36:11'),(17,'Copa 2','images/upload_baf9d121df69b92168c945ea596acc25',1,'2021-07-12 00:00:00','2021-07-29 00:00:00',26,'2021-07-06 14:02:19',46,'2021-07-06 16:36:27');
/*!40000 ALTER TABLE `competition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `id_competition` int NOT NULL,
  `id_responsible_user` int NOT NULL,
  `individual_value` decimal(5,2) DEFAULT NULL,
  `winner_tie_loser_points` int NOT NULL DEFAULT '3',
  `team_score_points` int NOT NULL DEFAULT '1',
  `stage1_weight` int NOT NULL DEFAULT '1',
  `stage2_weight` int NOT NULL DEFAULT '2',
  `stage3_weight` int NOT NULL DEFAULT '3',
  `stage4_weight` int NOT NULL DEFAULT '4',
  `stage5_weight` int NOT NULL DEFAULT '5',
  `percent_first_prize` int NOT NULL DEFAULT '70',
  `percent_second_prize` int NOT NULL DEFAULT '20',
  `percent_third_prize` int NOT NULL DEFAULT '10',
  `active` tinyint DEFAULT '1',
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_name_UNIQUE` (`name`),
  KEY `id_competition` (`id_competition`),
  KEY `id_responsible_user` (`id_responsible_user`),
  CONSTRAINT `game_ibfk_1` FOREIGN KEY (`id_competition`) REFERENCES `competition` (`id`),
  CONSTRAINT `game_ibfk_2` FOREIGN KEY (`id_responsible_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (16,'Bolão da Copa 1 - América',16,26,100.00,3,1,1,2,3,4,5,70,20,10,1,26,'2021-07-06 14:14:06',NULL,NULL),(17,'Bolão 1 da Copa 2',17,26,500.00,3,1,1,2,3,4,5,70,20,10,1,46,'2021-07-06 14:44:39',46,'2021-07-06 16:12:20'),(18,'Bolão 2 da Copa 2',17,26,250.00,3,1,1,2,3,4,5,70,20,10,1,46,'2021-07-06 14:44:56',NULL,NULL);
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_user`
--

DROP TABLE IF EXISTS `game_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_game` int NOT NULL,
  `id_user` int NOT NULL,
  `paid` tinyint DEFAULT '0',
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_game` (`id_game`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `game_user_ibfk_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id`),
  CONSTRAINT `game_user_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_user`
--

LOCK TABLES `game_user` WRITE;
/*!40000 ALTER TABLE `game_user` DISABLE KEYS */;
INSERT INTO `game_user` VALUES (37,16,46,1,26,'2021-07-06 14:14:49',NULL,NULL),(38,16,48,1,26,'2021-07-06 14:14:49',NULL,NULL),(39,16,47,1,26,'2021-07-06 14:14:49',NULL,NULL),(40,17,47,1,46,'2021-07-06 14:45:34',NULL,NULL),(41,17,46,1,46,'2021-07-06 14:45:34',NULL,NULL),(42,17,48,1,46,'2021-07-06 14:45:34',NULL,NULL),(43,17,49,1,46,'2021-07-06 14:45:34',NULL,NULL),(44,18,49,1,46,'2021-07-06 14:45:55',NULL,NULL),(45,18,46,1,46,'2021-07-06 14:45:55',NULL,NULL),(46,18,48,1,46,'2021-07-06 14:45:55',NULL,NULL),(47,18,55,0,46,'2021-07-07 14:48:40',NULL,NULL),(48,18,26,0,46,'2021-07-07 14:48:40',NULL,NULL);
/*!40000 ALTER TABLE `game_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guess`
--

DROP TABLE IF EXISTS `guess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guess` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_game` int NOT NULL,
  `id_match` int NOT NULL,
  `guess_team1` int NOT NULL,
  `guess_team2` int NOT NULL,
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UNIQUE` (`id_user`,`id_game`,`id_match`),
  KEY `id_game` (`id_game`),
  KEY `id_match` (`id_match`),
  CONSTRAINT `guess_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`),
  CONSTRAINT `guess_ibfk_2` FOREIGN KEY (`id_game`) REFERENCES `game` (`id`),
  CONSTRAINT `guess_ibfk_3` FOREIGN KEY (`id_match`) REFERENCES `matchx` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guess`
--

LOCK TABLES `guess` WRITE;
/*!40000 ALTER TABLE `guess` DISABLE KEYS */;
INSERT INTO `guess` VALUES (129,46,16,37,0,1,26,'2021-07-06 14:14:49',46,'2021-07-06 15:46:40'),(130,46,16,38,2,0,26,'2021-07-06 14:14:49',46,'2021-07-06 14:24:51'),(131,46,16,39,3,1,26,'2021-07-06 14:14:49',46,'2021-07-06 14:24:51'),(132,48,16,37,0,1,26,'2021-07-06 14:14:49',NULL,NULL),(133,48,16,38,2,1,26,'2021-07-06 14:14:49',NULL,NULL),(134,48,16,39,3,0,26,'2021-07-06 14:14:49',NULL,NULL),(135,47,16,37,1,1,26,'2021-07-06 14:14:49',NULL,NULL),(136,47,16,38,0,2,26,'2021-07-06 14:14:49',NULL,NULL),(137,47,16,39,2,1,26,'2021-07-06 14:14:49',NULL,NULL),(138,47,17,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(139,46,17,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(140,48,17,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(141,49,17,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(142,49,18,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(143,46,18,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(144,48,18,40,0,0,46,'2021-07-06 14:47:19',NULL,NULL),(145,47,17,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(146,46,17,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(147,48,17,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(148,49,17,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(149,49,18,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(150,46,18,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(151,48,18,41,0,0,46,'2021-07-06 14:47:49',NULL,NULL),(152,47,17,42,0,0,46,'2021-07-06 14:48:18',NULL,NULL),(153,46,17,42,1,2,46,'2021-07-06 14:48:18',46,'2021-07-06 14:51:34'),(154,48,17,42,0,0,46,'2021-07-06 14:48:18',NULL,NULL),(155,49,17,42,0,0,46,'2021-07-06 14:48:18',NULL,NULL),(156,49,18,42,0,0,46,'2021-07-06 14:48:18',NULL,NULL),(157,46,18,42,1,2,46,'2021-07-06 14:48:18',46,'2021-07-06 14:56:05'),(158,48,18,42,0,0,46,'2021-07-06 14:48:18',NULL,NULL),(159,47,17,43,0,0,46,'2021-07-06 14:48:43',NULL,NULL),(160,46,17,43,1,3,46,'2021-07-06 14:48:43',46,'2021-07-06 14:51:34'),(161,48,17,43,0,0,46,'2021-07-06 14:48:43',NULL,NULL),(162,49,17,43,0,0,46,'2021-07-06 14:48:43',NULL,NULL),(163,49,18,43,0,0,46,'2021-07-06 14:48:43',NULL,NULL),(164,46,18,43,1,3,46,'2021-07-06 14:48:43',46,'2021-07-06 14:56:05'),(165,48,18,43,0,0,46,'2021-07-06 14:48:43',NULL,NULL),(166,47,17,44,0,0,46,'2021-07-06 14:49:15',NULL,NULL),(167,46,17,44,1,2,46,'2021-07-06 14:49:15',46,'2021-07-06 14:53:24'),(168,48,17,44,0,4,46,'2021-07-06 14:49:15',NULL,NULL),(169,49,17,44,3,10,46,'2021-07-06 14:49:15',NULL,NULL),(170,49,18,44,0,0,46,'2021-07-06 14:49:15',NULL,NULL),(171,46,18,44,1,1,46,'2021-07-06 14:49:15',46,'2021-07-06 14:56:05'),(172,48,18,44,0,0,46,'2021-07-06 14:49:15',NULL,NULL),(173,47,17,45,1,0,46,'2021-07-06 14:49:38',NULL,NULL),(174,46,17,45,4,1,46,'2021-07-06 14:49:38',46,'2021-07-06 14:54:36'),(175,48,17,45,2,0,46,'2021-07-06 14:49:38',NULL,NULL),(176,49,17,45,0,0,46,'2021-07-06 14:49:38',NULL,NULL),(177,49,18,45,0,1,46,'2021-07-06 14:49:38',NULL,NULL),(178,46,18,45,3,1,46,'2021-07-06 14:49:38',46,'2021-07-06 14:56:05'),(179,48,18,45,0,0,46,'2021-07-06 14:49:38',NULL,NULL),(180,47,17,46,4,0,46,'2021-07-06 14:49:58',NULL,NULL),(181,46,17,46,3,1,46,'2021-07-06 14:49:58',46,'2021-07-06 14:51:34'),(182,48,17,46,2,2,46,'2021-07-06 14:49:58',NULL,NULL),(183,49,17,46,0,3,46,'2021-07-06 14:49:58',NULL,NULL),(184,49,18,46,3,2,46,'2021-07-06 14:49:58',NULL,NULL),(185,46,18,46,1,1,46,'2021-07-06 14:49:58',46,'2021-07-06 14:56:05'),(186,48,18,46,0,0,46,'2021-07-06 14:49:58',NULL,NULL),(187,47,17,47,0,0,46,'2021-07-06 15:44:38',NULL,NULL),(188,46,17,47,3,2,46,'2021-07-06 15:44:38',46,'2021-07-06 15:53:35'),(189,48,17,47,0,0,46,'2021-07-06 15:44:38',NULL,NULL),(190,49,17,47,0,0,46,'2021-07-06 15:44:38',NULL,NULL),(191,49,18,47,0,0,46,'2021-07-06 15:44:38',NULL,NULL),(192,46,18,47,4,2,46,'2021-07-06 15:44:38',46,'2021-07-06 15:50:30'),(193,48,18,47,0,0,46,'2021-07-06 15:44:38',NULL,NULL),(194,55,18,40,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(195,55,18,41,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(196,55,18,42,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(197,55,18,43,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(198,55,18,44,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(199,55,18,45,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(200,55,18,46,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(201,26,18,40,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(202,26,18,41,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(203,26,18,42,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(204,26,18,43,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(205,26,18,44,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(206,26,18,45,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(207,26,18,46,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(208,55,18,47,0,0,46,'2021-07-07 14:48:40',NULL,NULL),(216,26,18,47,0,0,46,'2021-07-07 14:48:40',NULL,NULL);
/*!40000 ALTER TABLE `guess` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matchx`
--

DROP TABLE IF EXISTS `matchx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matchx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_competition` int NOT NULL,
  `id_team1` int NOT NULL,
  `id_team2` int NOT NULL,
  `score_team1` int NOT NULL,
  `score_team2` int NOT NULL,
  `match_datetime` datetime NOT NULL,
  `stage` int NOT NULL,
  `groupx` char(1) DEFAULT NULL,
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_team1` (`id_team1`),
  KEY `id_team2` (`id_team2`),
  KEY `id_competition` (`id_competition`),
  CONSTRAINT `matchx_ibfk_1` FOREIGN KEY (`id_team1`) REFERENCES `team` (`id`),
  CONSTRAINT `matchx_ibfk_2` FOREIGN KEY (`id_team2`) REFERENCES `team` (`id`),
  CONSTRAINT `matchx_ibfk_3` FOREIGN KEY (`id_competition`) REFERENCES `competition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matchx`
--

LOCK TABLES `matchx` WRITE;
/*!40000 ALTER TABLE `matchx` DISABLE KEYS */;
INSERT INTO `matchx` VALUES (37,16,122,121,4,1,'2021-06-08 18:00:00',1,'A',26,'2021-07-06 14:11:56',46,'2021-07-06 14:28:56'),(38,16,123,124,3,2,'2021-06-22 18:00:00',1,'B',26,'2021-07-06 14:12:17',46,'2021-07-06 14:29:14'),(39,16,121,123,2,1,'2021-06-22 17:00:00',5,'',26,'2021-07-06 14:12:45',46,'2021-07-06 14:29:28'),(40,17,117,118,2,1,'2021-07-02 05:00:00',1,'A',46,'2021-07-06 14:47:19',46,'2021-07-06 15:02:22'),(41,17,119,108,1,1,'2021-07-04 04:00:00',1,'A',46,'2021-07-06 14:47:49',46,'2021-07-06 15:02:15'),(42,17,109,120,2,3,'2021-06-06 04:00:00',1,'B',46,'2021-07-06 14:48:18',46,'2021-07-06 15:02:25'),(43,17,110,111,0,0,'2021-07-03 03:00:00',1,'B',46,'2021-07-06 14:48:43',46,'2021-07-06 14:59:17'),(44,17,117,108,2,0,'2021-07-05 04:00:00',2,'',46,'2021-07-06 14:49:15',46,'2021-07-06 15:02:13'),(45,17,120,110,0,3,'2021-07-03 04:00:00',2,'',46,'2021-07-06 14:49:38',46,'2021-07-06 15:02:17'),(46,17,117,110,1,0,'2021-07-01 04:00:00',3,'',46,'2021-07-06 14:49:58',46,'2021-07-06 15:02:21'),(47,17,119,111,0,0,'2021-07-27 18:00:00',4,'',46,'2021-07-06 15:44:38',NULL,NULL);
/*!40000 ALTER TABLE `matchx` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `flag` varchar(255) DEFAULT NULL,
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (108,'Itália','images/upload_94bd8e9b60f99a3e857391a9c8b65672',26,'2021-06-28 22:07:09',NULL,NULL),(109,'País de Gales','images/upload_0a9a76aa3242eb054cf80915d3140242',26,'2021-06-28 22:08:14',NULL,NULL),(110,'Suíça','images/upload_2d6956b683af5f2be30e7cffc1a25a09',26,'2021-06-28 22:08:48',NULL,NULL),(111,'Turquia','images/upload_59acd3e890deef67e6472ef3456c73c5',26,'2021-06-28 22:09:28',NULL,NULL),(117,'Bélgica','images/upload_6ad497da4f56ca9654ce27e8f7cc7fed',26,'2021-07-06 14:04:42',NULL,NULL),(118,'Dinamarca','images/upload_2a960ae558cd162566b75ed9dd7975d5',26,'2021-07-06 14:04:58',NULL,NULL),(119,'Finlândia','images/upload_3c6ebb75fdea84216fe7d4089738290b',26,'2021-07-06 14:05:22',NULL,NULL),(120,'Rússia','images/upload_6b635b1c631f63e2f681506bde0d31a6',26,'2021-07-06 14:05:43',NULL,NULL),(121,'Brasil','images/upload_5ac19fdc044056a45dcd2df12b5c3e66',26,'2021-07-06 14:06:30',NULL,NULL),(122,'Argentina','images/upload_9926db34e5ed793cf92ae139b66a78ee',26,'2021-07-06 14:06:41',NULL,NULL),(123,'Chile','images/upload_dbb1ace9f567116bbc238d56f209a07e',26,'2021-07-06 14:06:56',NULL,NULL),(124,'Peru','images/upload_ff9288a9c791300b2413e094e07961fe',26,'2021-07-06 14:07:18',NULL,NULL);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_competition`
--

DROP TABLE IF EXISTS `team_competition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_competition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_team` int NOT NULL,
  `id_competition` int NOT NULL,
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_team` (`id_team`),
  KEY `id_competition` (`id_competition`),
  CONSTRAINT `team_competition_ibfk_1` FOREIGN KEY (`id_team`) REFERENCES `team` (`id`),
  CONSTRAINT `team_competition_ibfk_2` FOREIGN KEY (`id_competition`) REFERENCES `competition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_competition`
--

LOCK TABLES `team_competition` WRITE;
/*!40000 ALTER TABLE `team_competition` DISABLE KEYS */;
INSERT INTO `team_competition` VALUES (158,121,16,26,'2021-07-06 14:07:46',NULL,NULL),(159,122,16,26,'2021-07-06 14:07:46',NULL,NULL),(160,123,16,26,'2021-07-06 14:07:46',NULL,NULL),(161,124,16,26,'2021-07-06 14:07:46',NULL,NULL),(165,117,17,26,'2021-07-06 14:08:17',NULL,NULL),(166,118,17,26,'2021-07-06 14:08:17',NULL,NULL),(167,119,17,26,'2021-07-06 14:08:17',NULL,NULL),(168,108,17,26,'2021-07-06 14:08:17',NULL,NULL),(169,109,17,26,'2021-07-06 14:08:17',NULL,NULL),(170,120,17,26,'2021-07-06 14:08:17',NULL,NULL),(171,110,17,26,'2021-07-06 14:08:17',NULL,NULL),(172,111,17,26,'2021-07-06 14:08:17',NULL,NULL);
/*!40000 ALTER TABLE `team_competition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  `administrator` tinyint NOT NULL DEFAULT '0',
  `creation_user` int NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_update_user` int DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (24,'Luciano Normal','normal@gmail.com','U2FsdGVkX18SNxwIsCaupbIlbLu7Nv6bHsgOAkgjDsc=','images/upload_34eb7ef6f9ff6870780e49f8e3014222',1,0,23,'2021-05-17 20:32:44',26,'2021-06-29 22:36:56'),(26,'Luciano Admin','lucianorocho@yahoo.com.br','U2FsdGVkX18tpQYqHlJnax4D9xQhQv99tdYtCwFJ0T0=','images/upload_8067c11f3a97bdcaf51627276ee9dc2d',1,1,1,'2021-06-10 22:02:53',26,'2021-06-25 12:27:15'),(46,'User1000','user1000@gmail.com','U2FsdGVkX1+Pe90IS/GGgLr8yABLgpyK47ZvzjsRfqY=','images/upload_fa9dec58b46508cec3e8749e06043509',1,1,26,'2021-07-06 13:57:19',NULL,NULL),(47,'User2000','user2000@gmail.com','U2FsdGVkX1+lWDxLr7Xv4cK6JdVig/nOEpoBoztawMs=','images/upload_8a0187c63052142af011b3f10b6845d2',1,0,26,'2021-07-06 13:58:00',46,'2021-07-06 16:04:17'),(48,'User3000','user3000@gmail.com','U2FsdGVkX1+LElA2grKezPTUi5DisDQXHsNa/1QdgVw=','images/upload_479a6c7574f08f25e73abf443645f478',1,0,26,'2021-07-06 13:58:29',46,'2021-07-06 16:22:36'),(49,'User4000','user4000@gmail.com','U2FsdGVkX19/A5ZR30LyCjPG1VhPXI/dQGa4SlLqBf8=','images/upload_d01c15f44d94871acc1352beec7958dc',1,0,26,'2021-07-06 13:59:00',46,'2021-07-06 16:22:45'),(55,'Raul','raul.teixeira@gmail.com','U2FsdGVkX19bLOq0IWpO9sr6G0/x4xjl/PU0QoE9Tgyhz1+cP/WlsxGpCFtq2Amw','images/upload_7af24824d5b53c31c5d621762ff4c748',1,1,46,'2021-07-07 14:48:06',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-07 15:29:32
