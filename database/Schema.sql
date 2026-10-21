CREATE DATABASE EventDB;
GO


USE EventDB
GO
CREATE TABLE Users
(
	UserID INT IDENTITY(1,1) PRIMARY KEY,
	UserName nvarchar(50) NOT NULL,
	UserEmail nvarchar(100) NOT NULL,
	UserPhoneNumber INT
);


CREATE TABLE Category
(
	CategoryID INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName INT NOT NULL
);


CREATE TABLE Events (
 EventID INT IDENTITY(1,1) PRIMARY KEY,
 EventName VARCHAR(150) NOT NULL,
 EventOrganizer VARCHAR(150),
 EventCapacity INT NOT NULL,
 EventDate DATE NOT NULL,
 EventTime TIME NOT NULL,
 CategoryID INT NOT NULL,
 
 FOREIGN KEY (CategoryID)
  REFERENCES Category(CategoryID)
 );
