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
        feedback.textContent = "Fyll i namn, e-post och välj antal biljetter.";
        feedback.classList.add("error");
        feedback.classList.remove("success");
        return;
    }

    feedback.textContent = `Tack ${personName} för din bokning! Du har valt activityName och reserverat ${bookingQuantity} platser. Bekräftelse har skickats till ${personEmail}. Vid frågor kontakta oss på info@event.se`;
    feedback.classList.add("success");
    feedback.classList.remove("error");
});
