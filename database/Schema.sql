CREATE DATABASE EventDB;
GO



USE EventDB
GO
CREATE TABLE Account
(
	AccountID INT IDENTITY(1,1) PRIMARY KEY,
	AccountName NVARCHAR(50) NOT NULL,
	AccountEmail NVARCHAR(100) NOT NULL,
	AccountPhoneNumber INT
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
	AccountID INT NOT NULL,
	ActivityID INT NOT NULL
	
	FOREIGN KEY(AccountID)
		REFERENCES Account(AccountID),

	FOREIGN KEY(ActivityID)
		REFERENCES Activity(ActivityID)
);