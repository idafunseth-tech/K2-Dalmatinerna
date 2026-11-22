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

    if (activities == 0) {
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