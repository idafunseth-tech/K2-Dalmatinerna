// Get the button that opens the modal
const detailViewButton = document.getElementById("detail-view-button");
// Get modal
const modalWindow = document.getElementById("modal-window");
// Get the <span> element that closes the modal
const close = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
detailViewButton.addEventListener('click', () => {
  modalWindow.classList.add('show');
  document.body.classList.add('modal-open');
});

// When the user clicks on <span> (x), close the modal
close.addEventListener('click', () => {
  modalWindow.classList.remove('show');
  document.body.classList.remove('modal-open');
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modalWindow) {
    modalWindow.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// When the user presses escape, close the modal
document.addEventListener("keydown", function(event){
  if (event.key === "Escape") {
    modalWindow.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
});