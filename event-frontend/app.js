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

  // Hjälpfunktion så vi slipper upprepa classList-koden
  const showError = (message) => {
    feedback.textContent = message;
    feedback.classList.add("error");
    feedback.classList.remove("success");
  };

  // Helper function to display errors without repeating classList logic
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

  // Display booking confirmation and reset form
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