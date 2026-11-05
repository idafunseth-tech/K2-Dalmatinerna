# Normalization – from ER Model v3 to v4

## Scope and Basis
- Team: Dalmatinerna
- Selected part of the project: Booking forms for booking events.
- Tables under review: 
  - 03-logical-model
  - 04-logical-model
- Assumptions and business rules:
  - Each Booking can only relate to one Person and one Activity.
  - Each Activity can have one Location and one Organizer.
  - An Organizer can host many Activities.
  - A Location can host many Activities.

- Before model v3: [03-logical-model](https://github.com/idafunseth-tech/K2-Dalmatinerna/blob/feature-UpdateRepo-JT/docs/03-logical-model.png?raw=true)
- After model v4: [04-logical-model](https://github.com/idafunseth-tech/K2-Dalmatinerna/blob/main/docs/04-Logical-Model.png)

## 1. Before State – v3
| Table | Responsibility | PK | FK and referenced table |
| --- | --- | --- | --- |
| User | User personal details (UserName, UserEmail, UserPhoneNumber) | UserId | None |
| Booking | Connects a user to an event (BookedAt, BookingQuantity| BookingId | FkUserId -> UserId , FkEventId -> Event(EventId) |
| Event | Event information (EventName, EventDate, EventTime, EventCapacity, EventOrganizer) | EventId | FkCategoryId -> Category(CategoryId) |
| Category | Event category details (CategoryName) | CategoryId | None |

### Example Data and Repetition
- Redundant text fields:
  - EventLocation and EventOrganizer were stored as plain text fields directly inside the Event table, repeating whenever multiple events shared the saqme location or organizer.
- Transitive dependencies:
  - Location and Organizer details depended trasitively on the event rather than having their own independent primary key.
- Domain misalignment:
 - The User entity implied a registered system account with authentication, whereas the scope only requires storing contact details submitted via a booking form. 

### Situations to Test
1. Updating an organizers contatct details (Phone number or email) required modifying multiple rows across different events hosted by the same organizer.
2. Updating a locations adress shared by multiple events required updating text fields in multiple event records.
3. A new location or organizer could not be added to the system independently without creating a dummy event entry. 

## 2. Normal Form Check
### 1NF
- Check: one value per cell, no lists or repeating column groups, and identifiable rows.
- Our assessment and justification: All rows are identifiable by unique primary keys, and no columns contain non-atomic values.
- Change or verification: This version violates none of the rules for 1NF.

### 2NF
- Check: Ensure the model is in 1NF and that non-key attributes do not depend on only a part of a composite key.
- Our assessment and justification: Primary keys are single atributes (UserID, BookingID, EventID, CategoryID), so partial dependencies do not exist.

### 3NF
- Check: Ensure 2NF and eliminate transitive dependencies (non-key attributes depending on other non-key attributes).
- Are there non-key attributes that depend on the key via other non-key attributes? Yes. Organizer and Location details were stored transitively within Event.
- Change or verification: Extracted Location and Organizer into independent tables connected via FkLocationID and FkOrganizerID. Renamed Event to Activity and User to Person to align with entity semantics.

## 3. After State – v4
| Table | Responsibility | PK | FK and referenced table |
| --- | --- | --- | --- |
| Person | Personal details submitted in booking form (PersonName, PersonEmail, PersonPhoneNumber) | PkPersonID | None |
| Booking | Connects a person to an activity (BookedAt, BookingQuantity| PkBookingID | FkPersonID -> Person(PkPersonID) , FkActivityID-> Activity(ActivityID) |
| Activity | Activity information (ActivitytName, ActivityDateTime, ActivityCapacity) | PkActivityID | FkCategoryID -> Category(PkCategoryID), FkLocationID -> Location(PkLocationID), FkOrganizerID -> Organizer(PkOrganizerID) |
| Category | Activity category details (CategoryName) | PkCategoryID | None |
| Location | Location details (LocationName, LocationAdress) | PkLocationID | None |
| Organizer | Organizer contact details (OrganizerName, OrganizerEmail, OrganizerPhoneNumber) | PkOrganizerID | None |

### Justified Decisions
- Renamed User to Person: In initial versions, User represented an authenticated system account. Because the project scope shifted to an unauthenticated booking form submission system, Person accurately reflects storing basic contact info without login accounts.
- Renamed Event to Activity: Broadened semantic clarity to cover various scheduled offerings beyond traditional events.
- Extracted Location & Organizer: Created standalone tables for both entities to remove transitive dependencies from Activity and ensure contact/address changes happen in one single location.

## 4. Test Results
The tests are performed manually on the conceptual model.

| Situation and affected IDs | Expected result | Result in v3 | Result in v4 | Conclusion |
| --- | --- | --- | --- | --- |
| Updating an organizer's contact details (PkOrganizerID) | The organizer's info should be updated in a single place. | Required updating multiple text rows inside the Event table. | Updated in a single row in the Organizer table, reflecting across all hosted activities[cite: 1]. | Pass. 3NF achieved. Update anomalies are eliminated. |
| Updating a location's address (PkLocationID) | The address should be updated in a single place. | Required changing text fields across multiple event records. | Updated in a single row in the Location table. | Pass. Redundancy and update anomalies are removed. |
| Adding a new location or organizer | Adding a location/organizer should be possible without creating an activity. | Could not be added without creating dummy event entries or leaving null fields in Event. | Added directly into their respective tables (Location or Organizer) independently of any activities. | Pass. Insertion anomalies are successfully eliminated. |

## 5. Summary and Remaining Questions
- Most important conclusion: Moving from v3 to v4 achieved 3NF by extracting Location and Organizer into independent tables. The semantic shift from User to Person accurately reflects our decision to use a direct booking form instead of user account authentication.
- Reduced redundancy or avoided anomalies: All entity details (person info, locations, organizers, categories, activities) reside in dedicated tables without text duplication, eliminating update, insertion, and deletion anomalies.
- Remaining questions or assumptions to check: Should an activity support multiple organizers or locations in the future (requiring N:M junction tables), or is 1:N sufficient? Do we need to introduce ticket pricing/types linked to bookings later on? 
