# Business Rules

## 1. Purpose and scope
This document describes the business rules of the event booking system, where
users browse upcoming events and book places. It is the input for the ER model
and the 3NF schema.

## 2. Glossary
| Term     | Definition                                                                 |
|----------|----------------------------------------------------------------------------|
| User     | A person registered in the system who can book events                      |
| Event    | A scheduled activity with a date, time, location, and limited capacity     |
| Category | A label used to group events by interest                                   |
| Booking  | A user's reservation of one or more places at a specific event             |
| Capacity | The maximum number of places available for an event                        |

## 3. Business rules

### 3.1 Entity rules
| ID    | Rule                                                              | Source |
|-------|-------------------------------------------------------------------|--------|
| BR-00 | Every user shall have a unique identifier, a name, an email. and phone number | TBD    |
| BR-01 | Every event shall have a unique identifier and a name.            | TBD  |
| BR-02 | Every event shall have a date and a start time.                   | TBD  |
| BR-03 | Every event shall have a location.                                | TBD  |
| BR-04 | Every event shall have an organizer.                              | TBD  |
| BR-05 | Every event shall have a capacity.                                | TBD    |
| BR-06 | Every booking shall have a unique identifier, a booking timestamp, and a quantity. | TBD |
| BR-07 | Every category shall have a unique identifier and a name.         | TBD  |

### 3.2 Relationship rules
| ID    | Rule                                                           | Cardinality         | Source |
|-------|----------------------------------------------------------------|---------------------|--------|
| BR-10 | A user may make zero or many bookings.                         | User 1:N Booking    | TBD    |
| BR-11 | Each booking shall be made by exactly one user.                | (same)              | TBD    |
| BR-12 | An event may have zero or many bookings.                       | Event 1:N Booking   | TBD    |
| BR-13 | Each booking shall be for exactly one event.                   | (same)              | TBD    |
| BR-14 | Each event shall belong to exactly one category.               | Category 1:N Event  | TBD  |
| BR-15 | A category may contain zero or many events.                    | (same)              | TBD  |

Together, BR-10 to BR-13 mean that User and Event have a many-to-many
relationship, resolved through Booking.

### 3.3 Attribute and constraint rules
| ID    | Rule                                                           | Enforced by       |
|-------|----------------------------------------------------------------|-------------------|
| BR-20 | A user's email shall be unique.                                | UNIQUE constraint |
| BR-21 | A user's phone number shall be unique.                               | UNIQUE constraint |
| BR-22 | A category name shall be unique.                               | UNIQUE constraint |
| BR-23 | An event's capacity shall be greater than zero.                | CHECK constraint  |
| BR-24 | A booking's quantity shall be at least one.                    | CHECK constraint  |
| BR-25 | A booking's timestamp shall be set by the system when the booking is made. | Application / DEFAULT |

### 3.4 Process / behavior rules
| ID    | Rule                                                                              | Enforced by   |
|-------|-----------------------------------------------------------------------------------|---------------|
| BR-30 | The total quantity booked for an event shall not exceed its capacity.             | Application   |
| BR-31 | Only upcoming events shall appear in the public event list.                       | Application   |
| BR-32 | A booking shall not be created for an event that has already started.             | Application   |
| BR-33 | A user cannot be deleted while they have bookings.                                | FK (RESTRICT) |
| BR-34 | An event cannot be deleted while it has bookings.                                 | FK (RESTRICT) |
| BR-35 | A category cannot be deleted while events are assigned to it.                     | FK (RESTRICT) |

## 4. Assumptions and open questions
- Is the event organizer a User, or just a name? (currently: a plain attribute of Event.
  If it is a User, it becomes a relationship, User 1:N Event.)
- Is the location free text, or should venues be their own entity?
  (Repeating the same location text on many events may cause redundancy in 3NF.)
- Can an event belong to more than one category? (currently: no)
- Can a user book the same event more than once? (currently: yes, as separate bookings)
- Can a booking be cancelled or changed? (currently: not modeled)

## 5. Change log
| Date       | Change          | Author |
|------------|-----------------|--------|
| 2026-10-18 | Initial version |        |
