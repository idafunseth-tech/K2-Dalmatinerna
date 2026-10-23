USE EventDB;
GO


INSERT INTO Person (PersonName, PersonEmail, PersonPhoneNumber) person
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


INSERT INTO Activity (ActivityName, ActivityOrganizer, ActivityCapacity, ActivityDateTime, CategoryID)
VALUES
	(N'Summer Music Festival', N'Emma Johansson', 500, '2026-12-05T18:00:00', 3),
	(N'Tech Innovation Summit', N'Liam Andersson', 250, '2026-11-14T09:00:00', 6),
	(N'Winter Charity Gala', N'Olivia Karlsson', 150, '2026-12-19T19:30:00', 4),
	(N'Startup Pitch Night', N'Noah Nilsson', 80, '2026-11-03T17:30:00', 6),
	(N'Annual Book Fair', N'Ava Eriksson', 300, '2027-01-16T10:00:00', 2),
	(N'Spring Food Market', N'Lucas Larsson', 400, '2027-04-24T11:00:00', 7),
	(N'Yoga in the Park', N'Mia Olsson', 60, '2026-11-08T08:30:00', 1),
	(N'City Marathon', N'Oliver Persson', 2000, '2027-05-09T07:00:00', 1),
	(N'Photography Workshop', N'Sofia Svensson', 25, '2026-12-02T13:00:00', 5),
	(N'Local Art Exhibition', N'William Gustafsson', 120, '2027-02-13T16:00:00', 8);


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