--Adds information of deleted booking to CancellationLog
CREATE TRIGGER TRG_CanceledBooking
ON Booking
AFTER DELETE
AS
BEGIN
	INSERT INTO CancellationLog (BookingID, BookedAt, BookingQuantity, PersonID, ActivityID)
	SELECT
		BookingID,
		BookedAt,
		BookingQuantity,
		PersonID,
		ActivityID
	FROM deleted;
END;