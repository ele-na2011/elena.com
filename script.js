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
dragElement(document.getElementById("galleryWindow"));
dragElement(document.getElementById("calendarWindow"));


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
var galleryWindow = document.querySelector("#galleryWindow");
var calendarWindow = document.querySelector("#calendarWindow");

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

let slideIndex = 0;
let autoSlideTimer;

function changeSlide(n) {
  showSlide(slideIndex += n);
  resetAutoSlide ();
}

function currentSlide(n) {
  showSlide(slideIndex = n);
  resetAutoSlide ();
}

function showSlide(n) {
  const slides = document.querySelectorAll(".carouselItem");
  const dots = document.querySelectorAll(".dot");

  if (n >= slides.length) {slideIndex = 0}
  if (n < 0) {slideIndex = slides.length - 1}

  const carousel = document.querySelector(".carousel");
  carousel.style.transform = `translateX(${-slideIndex * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[slideIndex].classList.add("active");

  const captions = ["Image 1", "Image 2", "Image 3"];
  document.getElementById("caption").textContent = captions[slideIndex];
}

function autoSlide() {
  changeSlide(1);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(autoSlide, 5000);
}

const rowsContainer = document.getElementById("rowsContainer");
const addRowButton = document.getElementById("addRowButton");
const calculateButton = document.getElementById("calculateButton");
const resultDisplay = document.getElementById("resultDisplay");

function createRow () {
  const row = document.createElement("div");
  row.classList.add("row");

  row.innerHTML = `
    <input type = "number" placeholder = "Score (%) " class = "scoreInput">
    <input type = "number" placeholder = "Weight (%) " class = "weightInput">
    <button class = "removeRowButton">Remove</button>
  `;

  rowsContainer.appendChild(row);
}

for (let i = 0; i < 3; i++) {
  createRow();
}

addRowButton.addEventListener("click", createRow);

calculateButton.addEventListener("click", () => {
  const scoreInputs = document.querySelectorAll(".scoreInput");
  const weightInputs = document.querySelectorAll(".weightInput");

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (let i = 0; i < scoreInputs.length; i++) {
    const score = parseFloat(scoreInputs[i].value);
    const weight = parseFloat(weightInputs[i].value);

    if (isNan(score) || isNaN(weight)) continue;
    
    totalWeightedScore += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    resultDisplay.textContent = "Please enter at least one valid score and weight.";
  } else {
    const averageScore = totalWeightedScore / totalWeight;
    resultDisplay.textContent = `Average Score: ${averageScore.toFixed(2)}`;
  }

  const average = weightedSum/ totalWeight;
  resultDisplay.textContent = `Average Score: ${average.toFixed(2)}`;
});