-- Which users have booked which event and when the booking was done, sorted new to old.
-- Booking, User, and Event
-- Pimery Keys ar connected to their respective Foreign Keys.
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


SELECT
  b.BookingQuantity,
  e.EventName,
  e.EventId,
  COUNT
FROM Booking AS b
