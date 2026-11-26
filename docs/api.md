## User Needs

Users on **eventEtt** need to view current local events in the interface, open details for a selected event in a modal, and search and filter events without reloading the page.

## Base URL and Endpoint

### Base URL and Endpoint
* Base URL: http://localhost:5043
* Endpoint: /api/events
* Full URL: http://localhost:5043/api/events

## HTTP Method
`fetch` — Fetches a list of events (or a single object depending on the API response) that the frontend renders as cards in **activity-list** and corresponding modals in **api-modals**.

## Response Examples
In loadActivities(), the frontend handles plain JSON arrays, objects with an .items array, and single objects:
```json
  {
    "id": 1,
    "title": "Sommarkonsert i parken",
    "category": "Musik",
    "description": "Utomhuskonsert med lokala artister och foodtrucks.",
    "venue": "Stadsparkens friluftscen",
    "startsAt": "2027-07-05T18:00:00",
    "organizer": "Sommarmusik Produktion AB"
  }
```
## Fields Used
| Field | Usage in Frontend |
| :--- | :--- |
| `id` | Used as `data-id` on `.detail-view-button` and `.modal-window` to link the card, modal, and booking form. |
| `title` | Heading (`<h3>`) on the event card and (`<h2>`) in the modal header. |
| `category` | Category (`<p>`) on the card and in the modal. |
| `description` | Description text (`<p>`) on the card and in the modal body. |
| `venue` | Location displayed after `Plats:` on the card and in the modal. |
| `startsAt` | ISO date string formatted with `formatDate(iso)` in `sv-SE` (`day month year - Kl HH:MM`). |
| `organizer` | Organizer displayed after `Arrangör:`. |

## Loading, Empty, Success, and Error States

- **Loading state (`loadingState()`):** Runs when `loadActivities()` starts and renders `"Hämtar events..."` plus `.loading-spinner` inside `#activity-list` with `role="status"`.
  
- **Empty state (`emptyState()`):** Shown when the response is empty (`activities.length === 0`) with `"Det finns inga event att hitta just nu. Försök igen senare."` and a `.retry-button` that calls `loadActivities()`.
  
- **Success state:** When `response.ok` is true and `activities.length > 0`, cards are rendered in `#activity-list` and modals in `#api-modals`, enabling live filtering via `filterActivityCards()`.
  
- **Error state (`errorState()` / `getErrorMessage()`):** Checks `response.ok` and catches network or parsing errors in `try/catch`. Displays `.state-message.error` with `role="alert"` and `.retry-button` using user-friendly messages:
  - Missing `error.status` (network error): `"Servern kunde tyvärr inte nås just nu."`
  - `404`: `"Något gick fel. Vi kan inte hitta några events just nu."`
  - `500` and above: `"Oops... Något gick fel, försök igen senare!"`
  - Other HTTP errors: `"Något gick fel."`

## Security and Privacy Considerations

- **No exposure of technical details:** Interface error messages show only short, plain-language text; raw status codes, `console.error`, and stack traces stay in the developer log/console rather than being shown to the end user.
- **HTML escaping:** All API values pass through `escapeHtml(value)` (using `div.textContent` and `div.innerHTML`) before insertion via `.innerHTML` to help prevent XSS.
- **No sensitive data:** Only public event information is fetched; no API keys, tokens, or personal data are exposed in the frontend request.

## Known Limitations

- **No timeout or abort:** `fetch(apiUrl)` lacks `AbortController`, so slow or hanging API requests are not aborted automatically.
- **No caching:** Every page load or click on `"Försök igen"` issues a new `GET` request without local caching.
- **Bookings are not persisted via the API:** `.event-booking-form` handles confirmation locally in the frontend without sending data (for example via `POST`) to the backend or database.
- **No pagination or server-side search:** The full list is fetched in one request and filtered client-side in `filterActivityCards()`.
