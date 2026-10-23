CREATE DATABASE EventDB;
GO



USE EventDB
GO
CREATE TABLE Account
(
	AccountID INT IDENTITY(1,1) PRIMARY KEY,
	AccountName nvarchar(50) NOT NULL,
	AccountEmail nvarchar(100) NOT NULL,
	AccountPhoneNumber INT
);



CREATE TABLE Category
(
	CategoryID INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName INT NOT NULL
);



CREATE TABLE Activity (
 ActivityID INT IDENTITY(1,1) PRIMARY KEY,
 ActivityName VARCHAR(150) NOT NULL,
 ActivityOrganizer VARCHAR(150),
 ActivityCapacity INT NOT NULL,
 ActivityDate DATE NOT NULL,
 ActivityTime TIME NOT NULL,
 CategoryID INT NOT NULL,
 
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