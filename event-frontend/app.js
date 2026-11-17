// Get the button that opens the modal
// const detailViewButton = document.querySelectorAll('.detail-view-button');
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
/*detailViewButton.forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.id);
  });
});*/

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

const form = document.querySelector("#event-booking-form");
const personNameInput = document.querySelector("#person-name");
const personEmailInput = document.querySelector("#person-email");
const personPhoneNumberInput = document.querySelector("#person-phone-number")
const bookingQuantityInput = document.querySelector("#booking-quantity");
const feedback = document.querySelector("#booking-feedback");

form.addEventListener("submit", event => {
    event.preventDefault();

    const personName = personNameInput.value.trim();
    const personEmail = personEmailInput.value.trim();
    const personPhoneNumber = personPhoneNumberInput.value.trim();
    const bookingQuantity = bookingQuantityInput.value;

console.log(personName, personEmail, personPhoneNumber, bookingQuantity);

    if (personName === "" || personEmail === "" || personPhoneNumber === "" || bookingQuantity === "") {
        feedback.textContent = "Fyll i namn, e-post, telefonnummer och välj antal biljetter.";
        feedback.classList.add("error");
        feedback.classList.remove("success");
        return;
    }

    feedback.textContent = `Tack ${personName} för din bokning! Du har valt activityName och reserverat ${bookingQuantity} platser. Bekräftelse har skickats till ${personEmail}. Vid frågor kontakta oss på info@event.se`;
    feedback.classList.add("success");
    feedback.classList.remove("error");
});

const apiUrl = "http://localhost:5043/api/test/error";
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
          return "Ett simulerat serverfel.";
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