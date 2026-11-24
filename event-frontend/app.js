// Get the button that opens the modal
const detailViewButton = document.querySelectorAll('.detail-view-button');
// Get the <span> element that closes the modal
const close = document.getElementsByClassName("close")[0];

// Get modal
function openModal(id) {
  const modalWindow = document.querySelector(`.modal-window[data-id = "${id}"]`);
  if (!modalWindow || modalWindow.open) return;

  modalWindow.showModal();
  document.body.classList.add('modal-open');
}

function closeModal(modalWindow) {
  modalWindow.close();
}

// When the user clicks on the button, open the modal
detailViewButton.forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.id);
  });
});

document.addEventListener("close", (event) =>{
  if (event.target.matches(".modal-window")) {
    document.body.classList.remove('modal-open')
  }
}, true);

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

// Click listener (works for both API IDs 1-4 and hardcoded IDs 5-10)
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".detail-view-button");
    if (!btn) return;

    // Get the ID directly from the card's button
    const eventId = btn.dataset.id;

    // Locate the form
    const modal = document.querySelector(`.modal-window[data-id="${eventId}"]`) || document.querySelector(".modal-window");
    const form = modal.querySelector(".event-booking-form");

    // THE CONNECTION: Save the button's ID directly onto the form.
    form.dataset.eventId = eventId;
});


// EVENT BOOKING FORM
document.addEventListener("submit", (event) => {
    const form = event.target.closest(".event-booking-form");
    if (!form) return;

    event.preventDefault();

    // Retrieve the ID linked to the form by the card's button
    const eventId = form.dataset.eventId;

    const modalWindow = form.closest(".modal-window");
    const activityName = modalWindow.querySelector(".modal-header h2").textContent.trim();

    const personName = form.querySelector('[name="personName"]').value.trim();
    const personEmail = form.querySelector('[name="personEmail"]').value.trim();
    const personPhoneNumber = form.querySelector('[name="personPhoneNumber"]').value.trim();
    const bookingQuantity = form.querySelector('[name="bookingQuantity"]').value;

    const feedback = modalWindow.querySelector(".booking-feedback");

    if (personName === "" || personEmail === "" || personPhoneNumber === "" || bookingQuantity === "") {
        feedback.textContent = "Fyll i namn, e-post, telefonnummer och välj antal biljetter.";
        feedback.classList.add("error");
        feedback.classList.remove("success");
        return;
    }

    feedback.textContent = `Tack ${personName} för din bokning! Du har reserverat ${bookingQuantity} platser på event ${activityName}. Bekräftelse har skickats till ${personEmail} och till telefonnummer ${personPhoneNumber}. Vid frågor kontakta oss på info@event.se`;
    feedback.classList.add("success");
    feedback.classList.remove("error");

    form.reset();
});

const apiUrl = "http://localhost:5043/api/events";
const activityList = document.getElementById("activity-list");
const apiModals = document.getElementById("api-modals")

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

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
                <form class="event-booking-form">
                <h3>Boka event</h3>
                <div class="floating-group">
                    <input id="person-name" name="personName" type="text" inputmode="text" pattern="[A-Za-zÅÄÖåäö\s]+" 
                    oninput="this.value = this.value.replace(/[^a-zA-ZÅÄÖåäö\s]/g, '')" 
                    title="Ange för- och efternamn" placeholder=" " required>
                    <label for="person-name">Namn</label>
                </div>

                <div class="floating-group">
                    <input id="person-email" name="personEmail" type="email" 
                    title="Ange en giltig e-postadress" placeholder=" ">
                    <label for="person-email">E-post</label>
                </div>

                <div class="floating-group">
                    <input id="person-phone-number" name="personPhoneNumber" type="tel" inputmode="numeric" 
                    pattern="[0-9]{10}" maxlength="10" title="Ange ett giltigt telefonnummer" 
                    placeholder=" " required>
                    <label for="person-phone-number">Telefonnummer</label>
                </div>

                    <div class="floating-group">
                        <input id="booking-quantity" name="bookingQuantity" type="number" min="1" step="1" placeholder=" " oninput="if(this.value < 1 && this.value !== '') this.value = 1;" required>
                        <label for="booking-quantity">Antal biljetter</label>
                    </div>
                        <button type="submit">Boka biljetter</button>
                    </form>
                        <p class="booking-feedback" role="status" aria-live="polite"></p>
            </div>
        </div>
    </dialog>`
}

function loadingState() {
  activityList.innerHTML = `
  <section class="loading-state" role="status">
  <p>Hämtar events...</p>
  <p class="loading-spinner"></p>
  </section>`
}


function emptyState() {
  activityList.innerHTML = `
  <div class="empty-state">
  <p>Det finns inga event att hitta just nu. Försök igen senare.</p>
  <button class="retry-button">Försök igen</button>
  </div>`;
}

function errorState(message) {
  activityList.innerHTML = `
  <div class="state-message error" role="alert">
  <p>${escapeHtml(message)}</p>
  <button class="retry-button">Försök igen</button>
  </div>`;
}

function getErrorMessage(error) {
  if (!error.status) {
    return "Servern kunde tyvärr inte nås just nu."
  }

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

async function loadActivities() {
  loadingState();


  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

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

    if (activities.length === 0) {
      emptyState();
      return;
    }

    activityList.innerHTML = activities.map(createCard).join("");
    apiModals.innerHTML = activities.map(createModal).join("");
  } catch (error) {
    console.error("ERROR", error);
    errorState(getErrorMessage(error));
  }
}

activityList.addEventListener("click", (event) => {
  if (event.target.closest(".retry-button")) {
    loadActivities();
  }
});

loadActivities();

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

// Tracks the selected category filter (empty string means all categories)
let activeCategory = "";

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

applySavedMotionPreference();