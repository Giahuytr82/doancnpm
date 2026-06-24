-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: quanly
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20260614171823_InitialCreate','8.0.26'),('20260618024307_AddUserIdToReservation','8.0.26'),('20260618030909_AddDishesTable','8.0.26'),('20260620112141_AddTableNumberToReservation','8.0.26');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bugs`
--

DROP TABLE IF EXISTS `bugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bugs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Severity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ReportedBy` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bugs`
--

LOCK TABLES `bugs` WRITE;
/*!40000 ALTER TABLE `bugs` DISABLE KEYS */;
INSERT INTO `bugs` VALUES (5,'Đăng ký','Yêu cầu @ trong mail','Low','New','2026-06-24 22:18:36.088958','Nguyễn Hữu Trí'),(6,'Đăng ký','Mail đã bị trùng','Low','New','2026-06-24 22:19:12.566441','Nguyễn Hữu Trí'),(7,'Đăng nhập ','Mail hoặc mật khẩu không đúng','Medium','New','2026-06-24 22:31:59.026030','Nguyễn Hữu Trí'),(8,'Đặt bàn ','Thiếu số điện thoại','Low','New','2026-06-24 22:32:36.039565','Nguyễn Hữu Trí'),(9,'Đặt bàn','Cần chọn ngày','Low','New','2026-06-24 22:33:29.410864','Nguyễn Hữu Trí'),(10,'Đặt bàn','Chọn số lượng khách','Low','New','2026-06-24 22:33:41.688531','Nguyễn Hữu Trí'),(11,'Đặt bàn','Chọn khu vực ăn uống','Low','New','2026-06-24 22:33:56.032124','Nguyễn Hữu Trí'),(12,'Đặt bàn','Giờ phục vụ','Low','New','2026-06-24 22:34:29.201285','Nguyễn Hữu Trí'),(13,'Đặt bàn','Chọn chỗ ngồi','Low','New','2026-06-24 22:34:39.111099','Nguyễn Hữu Trí'),(14,'Đặt bàn','Số lượng khách tương ứng với khu vực','Low','New','2026-06-24 22:35:04.217902','Nguyễn Hữu Trí'),(15,'Đặt bàn','Chỗ ngồi đã đặt','Low','New','2026-06-24 22:35:21.983289','Nguyễn Hữu Trí'),(16,'Đặt bàn','Chỗ còn trống','Low','New','2026-06-24 22:35:35.974315','Nguyễn Hữu Trí'),(17,'Đặt bàn','Ngày không được đặt trong quá khứ','Medium','New','2026-06-24 22:35:51.767343','Nguyễn Hữu Trí'),(18,'Đặt bàn','Huỷ đặt bàn','Low','New','2026-06-24 22:36:01.799660','Nguyễn Hữu Trí'),(19,'Đặt bàn','Liên hệ với Hotline để huỷ','Low','New','2026-06-24 22:36:31.775489','Nguyễn Hữu Trí'),(20,'Đánh giá','Đăng nhập để đánh giá','Low','New','2026-06-24 22:36:55.101360','Nguyễn Hữu Trí'),(21,'Quản lý đặt bàn của admin','Xác nhận, xoá','Medium','New','2026-06-24 22:38:13.359310','Nguyễn Hữu Trí'),(22,'Quản lý phản hồi','Ẩn, xoá','Medium','New','2026-06-24 22:38:45.238567','Nguyễn Hữu Trí'),(23,'Quản lý lỗi','','Low','New','2026-06-24 22:38:59.885723','Nguyễn Hữu Trí'),(24,'Quản lý người dùng','Chưa xoá được','Low','New','2026-06-24 22:39:28.016784','Nguyễn Hữu Trí'),(25,'Quản lý món','Các Crud thêm sửa xoá món ăn','Medium','New','2026-06-24 22:39:53.551011','Nguyễn Hữu Trí');
/*!40000 ALTER TABLE `bugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Price` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Badge` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Rating` double NOT NULL,
  `ImageUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

LOCK TABLES `dishes` WRITE;
/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
INSERT INTO `dishes` VALUES (1,'Sashimi Kiệt Tác','2,450k','Tuyển chọn từ những loại cá béo ngậy và hải sản cao cấp nhất, nhập khẩu trực tiếp trong ngày từ chợ cá Toyosu tại Tokyo.','Bếp Trưởng Khuyên Dùng',4.9,'sashimi.png'),(2,'A5 Wagyu Đá Nướng','3,200k','Thịt bò Wagyu cực phẩm xếp hạng A5 nướng sơ trên đá núi lửa ấm nóng, giữ trọn vẹn vị ngọt đậm đà và vân mỡ mềm tan như bơ.','Giới Hạn Trong Ngày',5,'wagyu.png'),(3,'Kyoto Omakase','4,800k','Hành trình trải nghiệm ẩm thực độc quyền 12 món do chính Bếp trưởng phục vụ và sáng tạo ngẫu hứng trực tiếp tại quầy gỗ Hinoki.','Tinh Hoa Nghệ Thuật',5,'interior.png'),(4,'Tempura Thượng Hạng','1,250k','Tôm sú hoàng gia và rau củ theo mùa được chiên giòn hoàn hảo trong lớp bột Tempura mỏng nhẹ, giữ nguyên độ ngọt tự nhiên.','Ẩm Thực Giòn Rụm',4.8,'tempura.png'),(5,'Sushi Gan Ngỗng','1,850k','Sự kết hợp hoàn hảo giữa gan ngỗng béo ngậy áp chảo và xốt Unagi ngọt nhẹ trên nền cơm sushi dẻo thơm thượng hạng.','Hương Vị Béo Ngậy',4.9,'foie_gras_sushi.png'),(6,'Tôm Hùm Motoyaki','2,950k','Tôm hùm Nha Trang đút lò với xốt kem trứng Motoyaki béo cay đặc trưng, tôn lên vị ngọt giòn và săn chắc của thịt tôm hùm.','Hải Sản Vương Giả',5,'lobster_motoyaki.png'),(7,'Cơm Lươn Unagi','1,450k','Lươn Nhật nướng sốt Kabayaki gia truyền óng ánh phủ trên cơm nóng dẻo, rắc thêm chút lá tiêu Sansho thanh mát đánh thức vị giác.','Truyền Thống Nhật Bản',4.8,'unagi_don.png'),(8,'Matcha Fondant','650k','Bánh dung nham trà xanh Uji Matcha cao cấp tan chảy ấm nóng, ăn kèm kem vani lạnh và bụi vàng 24K dát mỏng quý phái.','Ngọt Ngào Tinh Tế',4.9,'matcha_dessert.png'),(9,'Mỳ Udon Tempura','280k','Sợi mỳ Udon dày dai truyền thống hòa quyện cùng nước súp Dashi thanh ngọt từ cá bào và tảo bẹ, dùng kèm với tôm Tempura chiên giòn rụm.','Phổ biến',4.9,'tempura_udon.png'),(10,'Takoyaki Truyền Thống','340k','Trải nghiệm với vỏ bánh giòn và nhân mực sữa tươi ngon đậm vị, đem cảm giác ấm áp vào ngày mưa','Món ăn đường phố',4.7,'243e4f01-9355-41b1-8913-f2eb6a3d0584_Screenshot 2026-06-24 224713.png');
/*!40000 ALTER TABLE `dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GuestName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `GuestPhone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `BookingDate` datetime(6) NOT NULL,
  `GuestCount` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SeatingPreference` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SelectedTime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `Status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserId` int DEFAULT NULL,
  `TableNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (14,'Huy','1123456789','2026-06-25 00:00:00.000000','3','Omakase Counter','11:30','2026-06-24 23:00:23.256853','Confirmed',18,'Omakase-01, Omakase-02, Omakase-03'),(15,'An Huy','2234567890','2026-06-25 00:00:00.000000','4','Small VIP Room','11:30','2026-06-24 23:03:09.391756','Confirmed',19,'VIP-Small');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CustomerName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Rating` int NOT NULL,
  `Comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `IsVisible` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (3,'Huy',5,'Giá cả đi đôi với chất lượng','2026-06-24 23:08:18.470582',1),(4,'An Huy',4,'Trải nghiệm của tôi chưa tốt với nhân viên, nên xem lại để tăng tầm chất lượng của quán','2026-06-24 23:09:04.806657',1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'Nguyễn Hữu Trí','Admin1701@gmail.com','0971402130','Admin1701','Admin','2026-06-24 13:17:27.536708'),(18,'Huy','Huy@gmail.com','1123456789','Huy@','User','2026-06-24 15:54:53.589803'),(19,'An Huy','AnHuy@gmail.com','2234567890','AnHuy@','User','2026-06-24 16:01:49.365577');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-24 23:12:31
