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

// Show a "loading" message and spinner while events are being fetched
function loadingState() {
  activityList.innerHTML = `
  <section class="loading-state" role="status">
  <p>Hämtar events...</p>
  <p class="loading-spinner"></p>
  </section>`
}

// Show a message (and retry button) when the API returns no events
function emptyState() {
  activityList.innerHTML = `
  <div class="empty-state">
  <p>Det finns inga event att hitta just nu. Försök igen senare.</p>
  <button class="retry-button">Försök igen</button>
  </div>`;
}

// Show an error message (and retry button) when loading fails
function errorState(message) {
  activityList.innerHTML = `
  <div class="state-message error" role="alert">
  <p>${escapeHtml(message)}</p>
  <button class="retry-button">Försök igen</button>
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


// -------- SEARCH FUNCTION SECTION --------
const searchForm = document.getElementById('search-form');
const searchInput = searchForm.querySelector('.search-input');

// Filters all activity cards based on what the user types in the search bar
function filterActivityCards() {
  const query = searchInput.value.trim().toLowerCase();
  
  // Hide the "about" section while searching, and show them again when the input is empty
  const sectionsToHide = document.querySelectorAll('.hide-on-search');
  sectionsToHide.forEach((section) => {
    section.style.display = query.length > 0 ? 'none' : '';
  });

  // Get all activity cards currently on the page (both hardcoded and API-fetched)
  const cards = document.querySelectorAll('.activity-card');

  cards.forEach((card) => {
    // Get all text inside the card and convert to lowercase to compare with the search query
    const cardText = card.textContent.toLowerCase();

    if (cardText.includes(query)) {
      card.style.display = ''; 
    } else {
      card.style.display = 'none'; // Hide cards that don't match
    }
  });

  // Check all outercard containers to hide any box that has 0 visible cards
  document.querySelectorAll('.outer-card').forEach((box) => {
    // Find all activity cards inside this specific outercard
    const cardsInside = box.querySelectorAll('.activity-card');

    // Only check outercards that actually hold activity cards (leaves the search bar untouched)
    if (cardsInside.length > 0) {
      // Count how many of the cards inside are still visible
      const visibleCards = Array.from(cardsInside).filter(
        (card) => card.style.display !== 'none'
      );

      // Hide the outercard if 0 cards match, otherwise show it
      box.style.display = visibleCards.length === 0 ? 'none' : '';
    }
  });
}

// Run the filter when the user clicks "Search" or presses Enter
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the browser from reloading the page
  filterActivityCards();
});

// Live search: filter immediately while typing, and show everything again if the input is cleared
searchInput.addEventListener('input', filterActivityCards);