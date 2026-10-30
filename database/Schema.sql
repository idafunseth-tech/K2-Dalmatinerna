CREATE DATABASE EventDB;
GO



USE EventDB
GO
CREATE TABLE Person
(
	PersonID INT IDENTITY(1,1) PRIMARY KEY,
	PersonName NVARCHAR(50) NOT NULL,
	PersonEmail NVARCHAR(100) NOT NULL,
	PersonPhoneNumber INT
);



CREATE TABLE Category
(
	CategoryID INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName NVARCHAR(50) NOT NULL
);



CREATE TABLE Activity (
 ActivityID INT IDENTITY(1,1) PRIMARY KEY,
 ActivityName NVARCHAR(150) NOT NULL,
 ActivityOrganizer NVARCHAR(150),
 ActivityLocation NVARCHAR(150),
 ActivityCapacity INT NOT NULL,
 ActivityDateTime DATETIME2 NOT NULL,
 CategoryID INT NOT NULL
 
 FOREIGN KEY (CategoryID)
  REFERENCES Category(CategoryID)
 );
 

 
 CREATE TABLE Booking
(
	BookingID INT IDENTITY(1,1) PRIMARY KEY,
	BookedAt DATETIME2 NOT NULL,
	BookingQuantity INT NOT NULL,
	PersonID INT NOT NULL,
	ActivityID INT NOT NULL
	
	FOREIGN KEY(PersonID)
		REFERENCES Person(PersonID),

	FOREIGN KEY(ActivityID)
		REFERENCES Activity(ActivityID)
);