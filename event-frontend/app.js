// Get the button that opens the modal
const detailViewButton = document.querySelectorAll('.detail-view-button');
// Get the <button> element that closes the modal
const close = document.getElementsByClassName("close")[0];

// Get modal
function openModal(id) {
  const modalWindow = document.querySelector(`.modal-window[data-id = "${id}"]`);
  // Do nothing if the modal doesn't exist or is already open
  if (!modalWindow || modalWindow.open) return;

  // Open modal (top layer + backdrop) and lock scrolling on the page behind it
  modalWindow.showModal();
  document.body.classList.add('modal-open');
}

// Close modal; the 'close' listener below then unlocks page scrolling
function closeModal(modalWindow) {
  modalWindow.close();
}

// When the user clicks on the button, open the modal
detailViewButton.forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.id);
  });
});

// When any modal closes, allow the page to scroll again.
document.addEventListener("close", (event) =>{
  if (event.target.matches(".modal-window")) {
    document.body.classList.remove('modal-open')
  }
}, true);

// When any modal closes, allow the page to scroll again.
document.addEventListener("click", (event) => {
  // Close button
  const closeBtn = event.target.closest(".modal-window .close");
  if (closeBtn) {
    closeModal(closeBtn.closest(".modal-window"));
    return;
  }

  // Click on the backdrop (outside .modal-content)
  if (event.target.classList.contains("modal-window")) {
    closeModal(event.target);
  }
});

// Backup escape listener incase of nonstandard browser e.g. VS Code
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-window[open]").forEach(closeModal);
  }
});

// -------- EVENT BOOKING FORM --------
// Listen for all form submissions via event delegation (works for both static and API modals)
document.addEventListener("submit", (event) => {
  const form = event.target.closest(".event-booking-form");
  if (!form) return;

  // Prevent page reload on submit
  event.preventDefault();
  
  // Get modal elements and event title
  const modalWindow = form.closest(".modal-window");
  const activityName = modalWindow.querySelector(".modal-header h2").textContent.trim();
  
  // Get and trim user input values
  const personName = form.querySelector('[name="personName"]').value.trim();
  const personEmail = form.querySelector('[name="personEmail"]').value.trim();
  const personPhoneNumber = form.querySelector('[name="personPhoneNumber"]').value.trim();
  const rawQuantity = form.querySelector('[name="bookingQuantity"]').value.trim();
  const bookingQuantity = Number(rawQuantity);
  const feedback = modalWindow.querySelector(".booking-feedback");

  // Helper function to display errors without repeating classList logic
  const showError = (message) => {
    feedback.textContent = message;
    feedback.classList.add("error");
    feedback.classList.remove("success");
  };

  // Check if name field is completely empty
  if (personName === "") {
      showError("Vänligen fyll i ditt namn.");
      form.querySelector('[name="personName"]').focus();
      return;
  }

  // Check if name is too short (at least 2 characters required)
  if (personName.length < 2) {
      showError("Namnet måste innehålla minst 2 bokstäver.");
      form.querySelector('[name="personName"]').focus();
      return;
  }

  // Validate email format
  if (personEmail === "" || !personEmail.includes("@")) {
      showError("Vänligen fyll i en giltig e-postadress.");
      form.querySelector('[name="personEmail"]').focus();
      return;
  }

  // Validate phone number (exactly 10 digits)
  if (!/^[0-9]{10}$/.test(personPhoneNumber)) {
      showError("Vänligen fyll i ett giltigt telefonnummer (10 siffror).");
      form.querySelector('[name="personPhoneNumber"]').focus();
      return;
  }

  // Validate ticket quantity (integer between 1 and 10)
  if (rawQuantity === "" || bookingQuantity < 1 || bookingQuantity > 10 || !Number.isInteger(bookingQuantity)) {
      showError("Välj mellan 1 och 10 biljetter.");
      form.querySelector('[name="bookingQuantity"]').focus();
      return;
  }
  // Format name (capitalize first letter) and ticket label
  const formattedName = personName.charAt(0).toUpperCase() + personName.slice(1);
  const ticketWord = bookingQuantity === 1 ? "plats" : "platser";

  // Display booking confirmation and reset form
  feedback.innerHTML = `
    <h3>Tack för din bokning, ${escapeHtml(formattedName)}!</h3>
    <p>Vi har reserverat dina biljetter för:</p>
    <ul>
      <li><b>Event:</b> ${escapeHtml(activityName)}</li>
      <li><b>Antal:</b> ${escapeHtml(bookingQuantity)} ${escapeHtml(ticketWord)}</li>
    </ul>
    <p>En bekräftelse har skickats till ${escapeHtml(personEmail)} och via SMS till ${escapeHtml(personPhoneNumber)}.</p>
    <p>Vid frågor, kontakta oss på info@event.se.</p>
  `;

  feedback.classList.add("success");
  feedback.classList.remove("error");

  form.reset();
});

// -------- API / RENDERING SECTION --------
// Endpoint that returns the list of events
const apiUrl = "http://localhost:5043/api/events";
// Container for the API event cards
const activityList = document.getElementById("activity-list");
// Container for the modals that belong to the API event cards
const apiModals = document.getElementById("api-modals")

// Escape special HTML characters in API data so it can't inject markup (XSS protection).
// Works by setting textContent on a temporary element and reading back the escaped innerHTML.
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

// Convert an ISO date string to Swedish format, e.g. "5 jul 2027 - Kl 18:00"
function formatDate(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("sv-SE", {
    day: "numeric", month: "short", year: "numeric"
  }).replace(".", "");
  const time = d.toLocaleTimeString("sv-SE", {
    hour: "2-digit", minute: "2-digit"
  });
  return `${date} - Kl ${time}`;
}

// Build the HTML for one event card from an API event object
function createCard(activity) {
  return `
  <article class="activity-card">
    <h3>${escapeHtml(activity.title)}</h3>
    <p>${escapeHtml(activity.category)}</p>
    <p>${escapeHtml(activity.description)}</p>
    <p><b>Plats: </b>${escapeHtml(activity.venue)}</p>
    <p><b>Tid: </b>${escapeHtml(formatDate(activity.startsAt))}</p>
    <p><b>Arrangör: </b>${escapeHtml(activity.organizer)}</p>
    <button class="detail-view-button" data-id="${escapeHtml(activity.id)}">Läs mer och boka</button>
  </article>`;
}

// Build the HTML for one modal (<dialog>) with event details and the booking form
function createModal(activity) {
  return `
    <dialog class="modal-window" data-id="${escapeHtml(activity.id)}">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" aria-label="Stäng">&times;</button>
                <h2>${escapeHtml(activity.title)}</h2>
                <p>${escapeHtml(activity.category)}</p>
            </div>
            <div class="modal-body">
                <p>${escapeHtml(activity.description)}</p>
                <br>
                <p><b>Plats:</b> ${escapeHtml(activity.venue)}</p>
                <p><b>Tid:</b> ${escapeHtml(formatDate(activity.startsAt))}</p>
                <p><b>Arrangör:</b> ${escapeHtml(activity.organizer)}</p>
                <br>
                    <hr>
            </div>
            <div class="modal-footer">
              <div class="booking-card">
                <form class="event-booking-form">
                <h3>Boka event</h3>
                <div class="floating-group">
                    <input id="person-name" name="personName" type="text" 
                    oninput="this.value = this.value.replace(/[^a-zA-ZÅÄÖåäö\s]/g, '')" placeholder=" ">
                    <label for="person-name">Namn</label>
                </div>

                <div class="floating-group">
                    <input id="person-email" name="personEmail" type="email" placeholder=" ">
                    <label for="person-email">E-post</label>
                </div>

                <div class="floating-group">
                    <input id="person-phone-number" name="personPhoneNumber" type="tel" inputmode="numeric" 
                    maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder=" ">
                    <label for="person-phone-number">Telefonnummer</label>
                </div>

                    <div class="floating-group">
                        <input id="booking-quantity" name="bookingQuantity" type="number" min="1" step="1" placeholder=" ">
                        <label for="booking-quantity">Antal biljetter</label>
                    </div>
                        <button type="submit">Boka biljetter</button>
                    </form>
                        <p class="booking-feedback" role="status" aria-live="polite"></p>
              </div>
            </div>
        </div>
    </dialog>`
}

// Show a "loading" message and spinner while events are being fetched
function loadingState() {
  activityList.innerHTML = `
  <section class="loading-state" role="status">
  <p>Hämtar events...</p>
  <p class="loading-spinner" aria-hidden="true"></p>
  </section>`
}

// Show a message (and retry button) when the API returns no events
function emptyState() {
  activityList.innerHTML = `
  <div class="empty-state">
  <p>Det finns inga event att hitta just nu. Försök igen senare.</p>
  <button type="button" class="retry-button">
    <svg class="retry-icon" viewBox="0 0 24 24" width="18" height="18" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
    <span>Försök igen</span>
  </button>
  </div>`;
}

// Show an error message (and retry button) when loading fails
function errorState(message) {
  activityList.innerHTML = `
  <div class="error-state" role="alert">
  <p>${escapeHtml(message)}</p>
  <button type="button" class="retry-button">
    <svg class="retry-icon" viewBox="0 0 24 24" width="18" height="18" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
    <span>Försök igen</span>
  </button>
  </div>`;
}

// Translate an error (with optional HTTP status) into a user-friendly Swedish message
function getErrorMessage(error) {
  // No status code means the request never reached the server (e.g. network error or server down)
  if (!error.status) {
    return "Servern kunde tyvärr inte nås just nu."
  }

  // Pick a message based on the HTTP status code
  switch (error.status) {
      case 404:
        return "Något gick fel. Vi kan inte hitta några events just nu.";
      default:
        if (error.status >= 500) {
          return "Oops... Något gick fel, försök igen senare!";
        }
        return "Något gick fel.";
  }
}

// Fetch events from the API and render the cards and modals
async function loadActivities() {
  loadingState();


  try {
    // Request the events
    const response = await fetch(apiUrl);

    // Treat non-2xx responses as errors and keep the status code for getErrorMessage()
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    // Parse the JSON body
    const data = await response.json();

    /* Normalise the response to an array: the API may return an array,
       an object with an 'items' array, or a single event object. */
    let activities;
    if (Array.isArray(data)) {
      activities = data;
    } else if (Array.isArray(data?.items)) {
      activities = data.items;
    } else if (data && typeof data === "object") {
      activities = [data];
    } else {
      activities = [];
    }

    // Checks if the response is empty
    if (activities.length === 0) {
      emptyState();
      return;
    }

    // Render a card and a modal for every event
    activityList.innerHTML = activities.map(createCard).join("");
    apiModals.innerHTML = activities.map(createModal).join("");
  } catch (error) {
    // Log the details for debugging and show a friendly message to the user
    console.error("ERROR", error);
    errorState(getErrorMessage(error));
  }
}

// Retry button (event delegation, since the button is re-created in every state)
activityList.addEventListener("click", (event) => {
  if (event.target.closest(".retry-button")) {
    loadActivities();
  }
});

// Load the events when the page loads
loadActivities();

/* Open the modal when a "Läs mer och boka" button on an API-rendered card is clicked
   (event delegation, since these cards are created after the page loads) */
activityList.addEventListener("click", (event) => {
  const button = event.target.closest(".detail-view-button");
  if (!button) return;
  openModal(button.dataset.id);
});


// -------- SEARCH & CATEGORY FILTER SECTION --------
const searchForm = document.getElementById("search-form");
const searchInput = searchForm ? searchForm.querySelector(".search-input") : null;
const inputWrapper = searchForm ? searchForm.querySelector(".input-wrapper") : null;
const categoryTagsContainer = document.querySelector(".category-tags");
const clearFiltersBtn = document.getElementById("clear-filters-btn");

// Tracks the selected category filter (empty string means all categories)
let activeCategory = "";



function hasActiveFilters() {
  const hasSearchText = searchInput ? searchInput.value.trim().length > 0 : false;
  const hasCategory = activeCategory.trim().length > 0;
  return hasSearchText || hasCategory;
}

function updateClearFiltersButton() {
  if (!clearFiltersBtn) return;
  clearFiltersBtn.hidden = !hasActiveFilters();
}

function clearAllFilters() {
  activeCategory = "";

  if (searchInput) {
    searchInput.value = "";
    searchInput.required = false;
  }

  if (categoryTagsContainer) {
    categoryTagsContainer.querySelectorAll(".category-tag").forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  suggestionsBox.innerHTML = "";
  suggestionsBox.classList.remove("open");
  updateClearFiltersButton();
  filterActivityCards();
}

// Create suggestion dropdown element inside .input-wrapper
const suggestionsBox = document.createElement("div");
suggestionsBox.className = "search-suggestions";
suggestionsBox.setAttribute("role", "listbox");
suggestionsBox.setAttribute("aria-label", "Sökförslag");
if (inputWrapper) {
  inputWrapper.appendChild(suggestionsBox);
}

// Extract searchable fields (title, venue, date, organizer) from a card element
function getCardSearchFields(card) {
  const title = (card.querySelector("h3")?.textContent || "").trim();
  const paragraphs = Array.from(card.querySelectorAll("p"));

  const venueLine = paragraphs.find((p) => p.textContent.includes("Plats:"))?.textContent || "";
  const dateLine = paragraphs.find((p) => p.textContent.includes("Tid:"))?.textContent || "";
  const organizerLine = paragraphs.find((p) => p.textContent.includes("Arrangör:"))?.textContent || "";

  const venue = venueLine.replace(/Plats:\s*/i, "").trim();
  const date = dateLine.replace(/Tid:\s*/i, "").trim();
  const organizer = organizerLine.replace(/Arrangör:\s*/i, "").trim();

  return [
    { label: "Titel", value: title },
    { label: "Plats", value: venue },
    { label: "Datum", value: date },
    { label: "Arrangör", value: organizer },
  ].filter((field) => field.value.length > 0);
}

// Check if any word in a text value starts with the query prefix
function startsWithWord(text, prefix) {
  const words = text.toLowerCase().split(/[\s,–-]+/);
  return words.some((word) => word.startsWith(prefix));
}

// Build and display suggestions where title, venue, date, or organizer starts with query
function updateSuggestions() {
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();
  if (query.length === 0) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("open");
    return;
  }

  const cards = Array.from(document.querySelectorAll(".activity-card"));
  const seen = new Set();
  const matches = [];

  cards.forEach((card) => {
    const fields = getCardSearchFields(card);
    fields.forEach((field) => {
      if (startsWithWord(field.value, query)) {
        const key = `${field.label.toLowerCase()}::${field.value.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push(field);
        }
      }
    });
  });

  if (matches.length === 0) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("open");
    return;
  }

  // Render up to 8 clickable suggestion buttons
  suggestionsBox.innerHTML = matches
    .slice(0, 8)
    .map(
      (item) => `
      <button type="button" class="suggestion-item" data-value="${escapeHtml(item.value)}">
        <span>${escapeHtml(item.value)}</span>
        <span class="suggestion-meta">${escapeHtml(item.label)}</span>
      </button>`
    )
    .join("");

  suggestionsBox.classList.add("open");
}

// Filters activity cards by both search query (matching title, venue, date, organizer) and category
function filterActivityCards() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const normalizedCategory = activeCategory.trim().toLowerCase();
  const isFiltering = query.length > 0 || normalizedCategory.length > 0;
  updateClearFiltersButton();

  // Hide informational sections while searching or filtering by category
  document.querySelectorAll(".hide-on-search").forEach((section) => {
    section.style.display = isFiltering ? "none" : "";
  });

  const cards = document.querySelectorAll(".activity-card");
  cards.forEach((card) => {
    const fields = getCardSearchFields(card);
    const searchableText = fields.map((f) => f.value.toLowerCase()).join(" ");
    const cardFullText = card.textContent.toLowerCase();

    const matchesQuery = query.length === 0 || searchableText.includes(query);
    const matchesCategory =
      normalizedCategory.length === 0 || cardFullText.includes(normalizedCategory);

    card.style.display = matchesQuery && matchesCategory ? "" : "none";
  });

  // Hide outer cards that have zero visible activity cards
  document.querySelectorAll(".outer-card").forEach((box) => {
    if (box.contains(searchForm)) return;

    const cardsInside = box.querySelectorAll(".activity-card");
    if (cardsInside.length > 0) {
      const visibleCount = Array.from(cardsInside).filter(
        (card) => card.style.display !== "none"
      ).length;
      box.style.display = visibleCount === 0 ? "none" : "";
    }
  });
}

// Select a suggestion when clicked
suggestionsBox.addEventListener("click", (event) => {
  const item = event.target.closest(".suggestion-item");
  if (!item || !searchInput) return;

  searchInput.value = item.dataset.value || "";
  searchInput.required = searchInput.value.trim().length > 0;
  suggestionsBox.classList.remove("open");
  filterActivityCards();
});

// Close suggestion dropdown when clicking outside the search input area
document.addEventListener("click", (event) => {
  if (!inputWrapper || !inputWrapper.contains(event.target)) {
    suggestionsBox.classList.remove("open");
  }
});

// Handle category tag clicks
if (categoryTagsContainer) {
  categoryTagsContainer.addEventListener("click", (event) => {
    const tag = event.target.closest(".category-tag");
    if (!tag) return;

    activeCategory = (tag.dataset.category || "").trim();

    categoryTagsContainer.querySelectorAll(".category-tag").forEach((btn) => {
      btn.classList.toggle("active", btn === tag);
    });

    if (searchInput) {
      searchInput.value = "";
      searchInput.required = false;
    }

    suggestionsBox.classList.remove("open");
    filterActivityCards();
  });
}

// Run filter on form submit and close suggestions
if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    suggestionsBox.classList.remove("open");
    filterActivityCards();
  });
}

// Update suggestions and filter cards live while typing
if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim().length > 0) {
      searchInput.required = true;
    }
    updateSuggestions();
    filterActivityCards();
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length > 0) {
      updateSuggestions();
    }
  });
}

// Reset search query, suggestion dropdown, and active category tag back to default
function clearAllFilters() {
  activeCategory = "";

  if (categoryTagsContainer) {
    categoryTagsContainer.querySelectorAll(".category-tag").forEach((btn) => {
      const isAllTag = (btn.dataset.category || "") === "";
      btn.classList.toggle("active", isAllTag);
    });
  }

  if (searchInput) {
    searchInput.value = "";
    searchInput.required = false;
  }

  suggestionsBox.innerHTML = "";
  suggestionsBox.classList.remove("open");
  filterActivityCards();
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearAllFilters);
}

// -------- REDUCED MOTION TOGGLE BUTTON --------
const toggleMotionBtn = document.getElementById("toggle-motion-btn");
const MOTION_STORAGE_KEY = "eventEtt_reduced_motion";

// Apply saved motion preference on page load if present
function applySavedMotionPreference() {
  const savedPreference = localStorage.getItem(MOTION_STORAGE_KEY);
  if (savedPreference === "true") {
    document.body.classList.add("reduced-motion");
  }
  updateMotionButtonState();
}

// Keep button label and aria-pressed attribute in sync with body class
function updateMotionButtonState() {
  if (!toggleMotionBtn) return;
  const isReduced = document.body.classList.contains("reduced-motion");
  toggleMotionBtn.setAttribute("aria-pressed", String(isReduced));
  toggleMotionBtn.textContent = isReduced
    ? "Minska animationer: På"
    : "Minska animationer: Av";
}

if (toggleMotionBtn) {
  toggleMotionBtn.addEventListener("click", () => {
    const isReduced = document.body.classList.toggle("reduced-motion");
    localStorage.setItem(MOTION_STORAGE_KEY, String(isReduced));
    updateMotionButtonState();
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearAllFilters);
}

updateClearFiltersButton();

applySavedMotionPreference();

