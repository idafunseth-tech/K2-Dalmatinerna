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