# Database Model

## Entities
- Form
- Events
- Booking

## Key Relationships
- There can only be one form per booking.
- There can be many bookings per form
- There can only be one event per booking.
- There can be many bookings per event.

## Assumptions
- A booking cannot exist without a form.
- A booking cannot exist without an event.

## Open Questions
- Should forms be stored permanently?
