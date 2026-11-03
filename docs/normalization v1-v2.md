# Normalization – from ER Model v1 to v2

## Scope and Basis
- Team: Dalmatinerna
- Selected part of the project: Booking forms for booking events.
- Tables under review: 
  - v1_1NF
  - v2_2NF
- Assumptions and business rules:
  - Each Booking can only relate to one User
  - Each Booking can only relate to one Event
  - Each Event can have many Bookings
  - Each User can have many Bookings

- Before model v1: [v1_1NF](https://drive.google.com/file/d/12_fXK5D_X11H_AXJBwJ5Nd_gEsD5VHrM/view?usp=drive_link)
- After model v2: [v2_2NF](https://drive.google.com/file/d/18tzZ8fFrBtjuZHA53LfZrLKPf17zoau9/view?usp=drive_link)

## 1. Before State – v1
| Table | What does a row represent? | Primary key (PK) | Foreign keys (FK) |
| --- | --- | --- | --- |
| v1 | Event bookings | FormId | - |

### Example Data and Repetition
- Necessarily repeated IDs for relationships:
  - None
- Duplicated descriptive facts or lists:
  - FormName
  - FormEmail
  - FormPhoneNumber
  - EventName
  - EventLocation
  - EventDate
  - EventTime
  - EventOrganizer
  - EventCategory

### Situations to Test
Choose at least two situations. State the affected tables and IDs.
1. If we need to change Felix's email adress we need to change FormEmail in both the F2 and F4 rows in table v1.
2. If an organizer wants to add another event there would be several empty cells since there is no booking to populate them.

## 2. Normal Form Check
### 1NF
- Check: one value per cell, no lists or repeating column groups, and identifiable rows.
- Our assessment and justification: FormId identifies the rows and none of the columns contain more than one value per cell.
- Change or verification: This version violates none of the rules for 1NF.

### 2NF
- Candidate keys the check is based on: FormId has a unique value for each row.
- Are there non-key attributes that depend on only part of a composite candidate key? The model depends on columns that are not the Primary Key.
- Change or verification: Split the model into 3 tables (Form, Booking, Event)

### 3NF
- Are there non-key attributes that depend on the key via other non-key attributes? EventCategory is dependent on EventName.
- Change or verification: This was kept in v2 but will be rectified later.

## 3. After State – v2
| Table | Responsibility | PK | FK and referenced table |
| --- | --- | --- | --- |
| Form | Information from a filled out booking from | FormId | FormId -> FkFormId |
| Booking | Date of booking | BookingId | FormId -> FkFormId , EventId -> FkEventId |
| Event | Event information | EventId | EventId -> FkEventId |

### Justified Decisions
- We split the v1 table to remove redundancies.
- We kept the columns from v1 but spit into several tables because they filled their purpose as they were.
- The relationships from v1 are preserved through the addition of the booking table using FkFormId and FkEventId.
- The same information is found in the v2 sheets, but split into the tables Form, Booking and Event.

## 4. Test Results
The tests are performed manually in the spreadsheet. They review the model,
not an implemented database or automatic PK/FK rules.

| Situation and affected IDs | Expected result | Result in v1 | Result in v2 | Conclusion |
| --- | --- | --- | --- | --- |
| Felix wants to change his email (FormEmail) | Due to how the form is structured we will need to update a changed Email in multiple places if required | We needed to make changes i multiple places | We needed to make changes i multiple places | Consider adding a table for users to handle personal information |
| An Organizer is adding a new event (EventId) | We should be able to add an event without causing an anomaly | It left several empty cells since there is no booking to populate them | Everything worked as expected | We split v1 into several tables one of which was Events. |

## 5. Summary and Remaining Questions
- Most important conclusion: The biggest issue remaining is the redundancy in the From table and if we need to adress it.
- Reduced redundancy or avoided anomalies: By splitting v1 into multiple tables we remove redundancies and (except the Form table)
- Remaining questions or assumptions to check: Should we add a user table to handle personal data?
