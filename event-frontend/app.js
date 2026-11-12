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

const apiUrl = "http://localhost:5043/api/events";
const activityList = document.getElementById("activity-list");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function createCard(activity) {
  return `
  <article class="activity-card">
    <h3>${escapeHtml(activity.title)}</h3>
    <p>${escapeHtml(activity.category)}</p>
    <p>${escapeHtml(activity.description)}</p>
    <p><b>Plats: </b>${escapeHtml(activity.venue)}</p>
    <p><b>Tid: </b>${escapeHtml(activity.startsAt)}
    <p><b>Arrangör: </b>${escapeHtml(activity.organizer)}</p>
    <button class="detail-view-button" data-id="${escapeHtml(activity.id)}">Läs mer och boka</button>
  </article>`;
}

async function loadActivities() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const activities = await response.json();

    activityList.innerHTML = activities.map(createCard).join("");
  } catch (error) {
    console.error("ERROR");
    activityList.innerHTML = "<p>ERROR</p>"
  }
}

loadActivities();

activityList.addEventListener("click", (event) => {
  console.log("clicked", event.target);
  const button = event.target.closest(".detail-view-button");
  console.log("button:", button);
  if (!button) return;
  console.log("id:", button.dataset.id);
  openModal(button.dataset.id);
});