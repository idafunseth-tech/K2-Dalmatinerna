



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

 CREATE TABLE Organizer
 (
  OrganizerID INT IDENTITY(1, 1) PRIMARY KEY,
  OrganizerName NVARCHAR(150) NOT NULL,
  OrganizerEmail NVARCHAR(100) NOT NULL,
  OrganizerPhoneNumber INT
 );

 CREATE TABLE Location 
 (
  LocationID INT IDENTITY(1, 1) PRIMARY KEY,
  LocationName NVARCHAR(150) NOT NULL,
  LocationAdress NVARCHAR(100) NOT NULL
 );



CREATE TABLE Activity (
 ActivityID INT IDENTITY(1,1) PRIMARY KEY,
 ActivityName NVARCHAR(150) NOT NULL,
 ActivityCapacity INT NOT NULL,
 ActivityDateTime DATETIME2 NOT NULL,
 CategoryID INT NOT NULL,
 OrganizerID INT NOT NULL,
 LocationID INT NOT NULL,
 
 FOREIGN KEY (CategoryID)
  REFERENCES Category(CategoryID),

  FOREIGN KEY (OrganizerID)
   REFERENCES Organizer(OrganizerID),

 FOREIGN KEY (LocationID)
  REFERENCES Location(LocationID)
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



CREATE TABLE CancellationLog
(
	CancellationLogID INT IDENTITY(1,1) PRIMARY KEY,
	BookingID INT NOT NULL,
	BookedAt DATETIME2 NOT NULL,
	BookingQuantity INT NOT NULL,
	PersonID INT NOT NULL,
	ActivityID INT NOT NULL,
	CancellationTime DATETIME2 NOT NULL DEFAULT GETDATE()
);