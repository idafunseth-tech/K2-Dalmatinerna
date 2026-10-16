## Core Data Domain

**The core data domain is defined based on the system's primary user flow:**
* When a user browses, selects and successfully completes an event booking.

---

### 1. Required Information to Store
To support the primary user flow, the system must store the following information:
* **User details:** Name, email address and phone number.
* **Event details:** Event name, location, date, time, organizer, total capacity and assigned category.
* **Booking details:** Booking date, time and quantity of booked seats.
* **Category details:** Category name for event classifcation.

---

### 2. Meaning of Information Types
* **User** – Represents an individual user who can make event bookings.
* **Booking** – Represents a transaction where a user reserves seats for a specific event.
* **Event** – Represents an upcoming activity or event that users can book.
* **Category** – Represents a classification type used to group related events.
---

### 3. Entities Requiring Unique Identity
The following entities have unique identifiers (Primary Keys / `PK`) to distinguish each instance over time:

| Entity | Primary Key (PK) | Description |
| :--- | :--- | :--- |
| **User** | `UserId` | Unique identifier for each registered user. |
| **Booking** | `BookingId` | Unique identifier for each individual booking transaction. |
| **Event** | `EventId` | Unique identifier for each scheduled event. |
| **Category** | `CategoryId` | Unique identifier for each event category. |

---

### 4. Required Relationships for User Flow
The primary relationships connecting the entities across the user flow:

* **User to Booking (`1 : N`)**  
  * `User.UserId` acts as a Foreign Key (`FKUserId`) in `Booking`.
* **Event to Booking (`1 : N`)**  
  * `Event.EventId` acts as a Foreign Key (`FkEventId`) in `Booking`.
* **Category to Event (`1 : N`)**  
  * `Category.CategoryId` acts as a Foreign Key (`FkCategoryId`) in `Event`.
