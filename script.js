//update time every second
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

dragElement(document.getElementById("welcome")); // Make the welcome window draggable

function dragElement(element) {
  const handle = document.getElementById(element.id + "welcomeHandler") || element;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
  }

  function elementDrag(e) {
    e.preventDefault();
    element.style.top = (element.offsetTop + e.movementY) + "px";
    element.style.left = (element.offsetLeft + e.movementX) + "px";
  }

  function closeDragElement() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

var welcomeScreen = document.querySelector("#welcome");
function closeWindow(element) {
  element.style.display = "none";
}
function openWindow(element) {
    element.style.display = "flex";
    }

var welcomeScreenClose = document.querySelector("#closeButton");
var welcomeScreenOpen = document.querySelector("#openWelcome");

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});
