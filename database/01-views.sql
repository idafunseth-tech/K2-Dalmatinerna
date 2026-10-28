USE EventDB;
GO

CREATE VIEW [ActivityBookedSlots]
AS
SELECT
  a.ActivityID,
  a.ActivityName,
  SUM(b.BookingQuantity) AS TotalQuantity
FROM Booking AS b
INNER JOIN Activity AS a
  ON a.ActivityID = b.ActivityID
GROUP BY a.ActivityID, a.ActivityName;