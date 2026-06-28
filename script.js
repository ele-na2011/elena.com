//update time every second
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// Define coordinates (Example: New York City)
const LATITUDE = 43.46671;
const LONGITUDE = 79.69031;

// Open-Meteo API URL
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true`;

async function fetchTemperature() {
  try {
    // 1. Fetch data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // 2. Extract the current temperature from the JSON structure
    const temperature = data.current_weather.temperature;
    
    // 3. Select your HTML element and update its content
    document.getElementById('temperatureDisplay').innerHTML = `${temperature}°C`;
    
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('temperatureDisplay').textContent = "Error loading";
  }
}

// Execute the function when the script loads
fetchTemperature();


// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("notebookWindow"));
dragElement(document.getElementById("embedPlaylistWindow"));
dragElement(document.getElementById("resumeWindow"));

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
var resumeWindow = document.querySelector("#resumeWindow");

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