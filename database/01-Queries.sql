SELECT
  b.BookingID,
  p.PersonName,
  a.ActivityName,
  b.BookedAt
FROM Booking AS b
INNER JOIN Person AS p
  ON p.PersonID = b.PersonID
INNER JOIN Activity AS a
  ON a.ActivityID = b.ActivityID
ORDER BY b.BookedAt DESC;


SELECT
  a.ActivityID,
  a.ActivityName,
  SUM(b.BookingQuantity) AS TotalQuantity
FROM Booking AS b
INNER JOIN Activity AS a
  ON a.ActivityID = b.ActivityID
GROUP BY a.ActivityID, a.ActivityName;