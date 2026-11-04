USE EventDB;
GO


INSERT INTO Person (PersonName, PersonEmail, PersonPhoneNumber)
VALUES
	(N'Emma Johansson', N'emma.johansson@example.com', 0701234567),
	(N'Liam Andersson', N'liam.andersson@example.com', 0702345678),
	(N'Olivia Karlsson', N'olivia.karlsson@example.com', 0703456789),
	(N'Noah Nilsson', N'noah.nilsson@example.com', 0704567890),
	(N'Ava Eriksson', N'ava.eriksson@example.com', 0705678901),
	(N'Lucas Larsson', N'lucas.larsson@example.com', 0706789012),
	(N'Mia Olsson', N'mia.olsson@example.com', 0707890123),
	(N'Oliver Persson', N'oliver.persson@example.com', 0708901234),
	(N'Sofia Svensson', N'sofia.svensson@example.com', 0709012345),
	(N'William Gustafsson', N'william.gustafsson@example.com', 0700123456);


INSERT INTO Category (CategoryName)
VALUES
	(N'Exersise'),
	(N'Culural'),
	(N'Music'),
	(N'Fundraising'),
	(N'Workshop'),
	(N'Business'),
	(N'Food'),
	(N'Art');

INSERT INTO Location (LocationName, LocationAdress)
VALUES
	(N'Sundsvall City', N'SveaVägen 2 Sundsvall'),
	(N'Östermalm Torg', N'Östermalmvägen 4 Stockholm'),
	(N'Liseberg', N'Lisebergvägen 5 Göteborg');

INSERT INTO Organizer (OrganizerName, OrganizerEmail, OrganizerPhoneNumber)
VALUES
	(N'UpplevelseTorget', N'UTorget@Example.se', 0738745566),
	(N'DjurFonden', N'DF@Example.se', 0727567788),
	(N'BiljettMannen', N'MannenB@Example.se', 0734446677)



INSERT INTO Activity (ActivityName, ActivityCapacity, ActivityDateTime, CategoryID, LocationID, OrganizerID)
VALUES
	(N'Summer Music Festival', 500, '2026-12-05T18:00:00', 3, 3, 1),
	(N'Tech Innovation Summit', 250, '2026-11-14T09:00:00', 6, 1, 1), 
	(N'Winter Charity Gala', 150, '2026-12-19T19:30:00', 4, 2, 2),
	(N'Startup Pitch Night', 80, '2026-11-03T17:30:00', 6, 1, 3),
	(N'Annual Book Fair', 300, '2027-01-16T10:00:00', 2, 1, 3),
	(N'Spring Food Market', 400, '2027-04-24T11:00:00', 7, 3, 1),
	(N'Yoga in the Park', 60, '2026-11-08T08:30:00', 1, 2, 2),
	(N'City Marathon', 2000, '2027-05-09T07:00:00', 1, 2, 2),
	(N'Photography Workshop', 25, '2026-12-02T13:00:00', 5, 1, 3),
	(N'Local Art Exhibition', 120, '2027-02-13T16:00:00', 8, 2, 3);


INSERT INTO Booking (BookedAt, BookingQuantity, PersonID, ActivityID)
VALUES
	('2026-11-02T09:15:00', 3, 7, 4),
	('2026-11-09T14:30:00', 5, 2, 9),
	('2026-11-16T11:00:00', 1, 10, 6),
	('2026-11-23T16:45:00', 4, 5, 1),
	('2026-12-01T08:00:00', 2, 8, 8),
	('2026-12-08T19:20:00', 5, 3, 10),
	('2026-12-15T13:10:00', 3, 6, 2),
	('2027-01-12T10:30:00', 1, 9, 5),
	('2027-01-19T17:00:00', 4, 1, 7),
	('2027-01-26T12:40:00', 2, 4, 3);

	SELECT * FROM Organizer;