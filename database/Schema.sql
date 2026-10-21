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