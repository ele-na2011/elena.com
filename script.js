//update time every second
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("notebookWindow"));
dragElement(document.getElementById("embedPlaylistWindow"));

function dragElement(element) {
  const handle = document.getElementById(element.id + "Handler") || element;
  let offsetX = 0;
  let offsetY = 0;

  handle.onmousedown = function (e) {
    e.preventDefault();
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  };

  function drag(e) {
    e.preventDefault();
    element.style.left = (e.clientX - offsetX) + "px";
    element.style.top = (e.clientY - offsetY) + "px";
  }

  function stopDrag() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

var topBar = document.querySelector("#top");
var welcomeScreen = document.querySelector("#welcome");
var notebookWindow = document.querySelector("#notebookWindow");
var embedPlaylistWindow = document.querySelector("#embedPlaylistWindow");

function closeWindow(element) {
  element.style.display = "none";
}
function openWindow(element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1; // Ensure the top bar is always above the windows
}

var welcomeScreenOpen = document.querySelector("#openWelcome");

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
}

var biggestIndex = 1;

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1; // Ensure the top bar is always above the windows
  deselectIcon(selectedIcon);
}

function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  addWindowTapHandling(screen);
  dragElement(screen);
}