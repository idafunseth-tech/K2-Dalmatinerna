-- Which users have booked which event and when the booking was done, sorted new to old.
-- Booking, User, and Event
-- Pimery Keys ar connected to their respective Foreign Keys.
/*
Query: Which users have booked which event and when the booking was done, sorted new to old.
One row represents: One booking.
*/
SELECT
  b.BookingId,
  u.UserName,
  e.EventName
  b.BookedAt
FROM Booking AS b
INNER JOIN User AS u
  ON u.UserId = b.UserId
INNER JOIN Event AS e
  ON e.EventId = b.EventId
ORDER BY b.BookedAt DESC

/*
Query: Total quantity of event bookings.
One row represents: One event.
*/
SELECT
  e.EventId,
  e.EventName,
  SUM(b.BookingQuantity) AS TotalQuantity
FROM Booking AS b
INNER JOIN Event AS e
  ON e.EventId = b.EventId
GROUP BY EventId
