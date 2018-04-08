-- MySQL dump 10.13  Distrib 5.7.21, for Linux (x86_64)
--
-- Host: localhost    Database: booklove
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boeken`
--

DROP TABLE IF EXISTS `boeken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boeken` (
  `ISBN` bigint(20) NOT NULL,
  `titel` text CHARACTER SET utf8,
  `auteur` text CHARACTER SET utf8,
  PRIMARY KEY (`ISBN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boeken`
--

LOCK TABLES `boeken` WRITE;
/*!40000 ALTER TABLE `boeken` DISABLE KEYS */;
INSERT INTO `boeken` VALUES (9789023466413,'De acht bergen','Paolo Cognetti'),(9789029523950,'Slotcouplet','Sander de Hosson'),(9789048840243,'Gordon','Marcel Langedijk'),(9789400406254,'Mythos','Steven Fry'),(9789492798039,'Lichter','William Cortvriendt');
/*!40000 ALTER TABLE `boeken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gebruikers`
--

DROP TABLE IF EXISTS `gebruikers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gebruikers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gebruikerGeslacht` text CHARACTER SET utf8,
  `naam` text CHARACTER SET utf8,
  `woonplaats` text CHARACTER SET utf8,
  `geboortedatum` date DEFAULT NULL,
  `partnerGeslacht` text CHARACTER SET utf8,
  `gekozenGebruikers` text CHARACTER SET utf8,
  `email` varchar(30) DEFAULT NULL,
  `hash` text CHARACTER SET utf8,
  `gelezenBoeken` varchar(999) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gebruikers`
--

LOCK TABLES `gebruikers` WRITE;
/*!40000 ALTER TABLE `gebruikers` DISABLE KEYS */;
INSERT INTO `gebruikers` VALUES (1,'man','Jim','Amsterdam','2018-04-12','vrouw',NULL,'jimvandeven_1@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$8+nSUnczC3sZ3RfA6K5iPw$17f/DTq1VQf0sDNavlU3j6TX1M0SeldasXl3VdDkKDo',NULL),(2,'vrouw','Suzanne','Amsterdam','1988-10-31','man',NULL,'suzanne@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$+bGiA+EewTxbhXP1m5qosw$SNTErHPREQvihag+HMfZ9OAGFSh7K1rpE/mrrCbKviU',NULL),(3,'vrouw','Merel','Amsterdam','1993-08-12','man',NULL,'merel@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$JGz89Qft/5gvx1Kb8f+bDA$QKz6hZ6daTRfIO7EyEY7nd6EWxMowrieR9pwqdjf+3w',NULL),(4,'vrouw','Marlies','Amsterdam','1993-08-12','man',NULL,'marlies@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$1NCtQoHzA1SaOoBfc19VpA$3TipVA4RddtW3CnvbzM/2ibhTnKfywgNRZBgrb2wII8',NULL),(5,'vrouw','Kees','Amsterdam','2018-04-20','man',NULL,'kees@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$EM+7FzFM5iRU3Cy4vpv66w$UIGcsBQRtnl8cNUDoQM2mruGxeI+lYvcGtu8xzqZNCI',NULL),(6,'vrouw','Lisa','Amsterdam','2018-04-05','man',NULL,'lisa@hotmail.com','$argon2i$v=19$m=4096,t=3,p=1$fXx9fXHA4jHnXRx0Yci9/w$WNEM1JEBjy9mibjg7n7iMDd8C6XdcWaCcUS2woYkgvI',NULL);
/*!40000 ALTER TABLE `gebruikers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gelezenBoekenTabel`
--

DROP TABLE IF EXISTS `gelezenBoekenTabel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gelezenBoekenTabel` (
  `email` varchar(10000) DEFAULT NULL,
  `ISBN` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gelezenBoekenTabel`
--

LOCK TABLES `gelezenBoekenTabel` WRITE;
/*!40000 ALTER TABLE `gelezenBoekenTabel` DISABLE KEYS */;
INSERT INTO `gelezenBoekenTabel` VALUES ('jimvandeven_1@hotmail.com','9789023466413'),('suzanne@hotmail.com','9789048840243'),('suzanne@hotmail.com','9789023466413'),('marlies@hotmail.com','9789048840243'),('jimvandeven_1@hotmail.com','9789048840243'),('kees@hotmail.com','9789492798039'),('lisa@hotmail.com','9789029523950'),('lisa@hotmail.com','9789048840243');
/*!40000 ALTER TABLE `gelezenBoekenTabel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-08 15:36:03
