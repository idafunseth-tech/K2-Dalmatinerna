--Deletes booking with chosen BookingID.
DELETE FROM Booking WHERE BookingID = 26;

SELECT * FROM Booking;
SELECT * FROM CancellationLog;
GO

--Deletes bookings with BookingID between chosen numbers.
DELETE FROM Booking WHERE BookingID BETWEEN 27 AND 30;

SELECT * FROM Booking;
SELECT * FROM CancellationLog;