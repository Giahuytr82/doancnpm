CREATE DATABASE IF NOT EXISTS JapanWebDb;
USE JapanWebDb;

CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) DEFAULT 'User',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `Reservations`
CREATE TABLE IF NOT EXISTS `Reservations` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GuestName` longtext NOT NULL,
  `GuestPhone` longtext NOT NULL,
  `BookingDate` datetime(6) NOT NULL,
  `GuestCount` longtext NOT NULL,
  `SeatingPreference` longtext NOT NULL,
  `SelectedTime` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `Status` longtext NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `Bugs`
CREATE TABLE IF NOT EXISTS `Bugs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` longtext NOT NULL,
  `Description` longtext,
  `Severity` longtext NOT NULL,
  `Status` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ReportedBy` longtext,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `Reviews`
CREATE TABLE IF NOT EXISTS `Reviews` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CustomerName` longtext NOT NULL,
  `Rating` int NOT NULL,
  `Comment` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `IsVisible` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
