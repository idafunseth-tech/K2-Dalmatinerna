// Get the button that opens the modal
const detailViewButton = document.getElementById("detail-view-button");
// Get modal
const modalWindow = document.getElementById("modal-window");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("span")[0];

// When the user clicks on the button, open the modal
detailViewButton.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalWindow) {
    modal.style.display = "none";
  }
}