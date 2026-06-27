//update time every second
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("notebook"));
dragElement(document.getElementById("embedPlaylist"));

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


var welcomeScreen = document.querySelector("#welcome");
var notebook = document.querySelector("#notebook");
var embedPlaylist = document.querySelector("#embedPlaylist");

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


var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    openWindow(notebook);
  } else {
    selectIcon(element);
  }
}

