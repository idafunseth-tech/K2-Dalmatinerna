// Get the button that opens the modal
const detailViewButton = document.querySelectorAll('.detail-view-button');
// Get the <span> element that closes the modal
const close = document.getElementsByClassName("close")[0];

// Get modal
function openModal(id) {
  const modalWindow = document.querySelector(`.modal-window[data-id = "${id}"]`);
  if (!modalWindow) return;

  modalWindow.classList.add('show');
  document.body.classList.add('modal-open');
}

function closeModal(modalWindow) {
  modalWindow.classList.remove('show');
  document.body.classList.remove('modal-open');
}

// When the user clicks on the button, open the modal
detailViewButton.forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.id);
  });
});

// When the user clicks on <span> (x), close the modal
document.querySelectorAll('.modal-window .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeModal(closeBtn.closest('.modal-window'))
  });
});

// When the user clicks anywhere outside of the modal, close it
document.querySelectorAll('.modal-window').forEach(modal => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

// When the user presses escape, close the modal
document.addEventListener("keydown", function(event){
  if (event.key === "Escape") {
    document.querySelectorAll('.modal-window.show').forEach(closeModal);
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