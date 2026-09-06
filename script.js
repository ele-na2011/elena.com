//update time every second
function updateTime() {
    const now = new Date();
    const dateText = document.querySelector("#dateElement");
    const timeText = document.querySelector("#timeElement");

    const date = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    if (dateText) dateText.textContent = date;
    if (timeText) timeText.textContent = `${hours}:${minutes}`;
}

setInterval(updateTime, 1000);
updateTime();

const timeToggle = document.querySelector("#timeToggle");
const systemStatus = document.querySelector(".system-status");

const weatherCard = document.querySelector("#weatherCard");

function toggleWeatherCard() {
  const isOpen = !weatherCard.hidden;
  weatherCard.hidden = isOpen;
  if (timeToggle) timeToggle.setAttribute("aria-expanded", String(!isOpen));
}

function toggleTemperature() {
  toggleWeatherCard();
}

if (timeToggle && systemStatus) {
  timeToggle.addEventListener("click", toggleTemperature);
  timeToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTemperature();
    } else if (event.key === "Escape") {
      weatherCard.hidden = true;
      timeToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Define coordinates (Example: New York City)
const LATITUDE = 43.46671;
const LONGITUDE = 79.69031;

// Open-Meteo API URL
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=4&timezone=auto`;

const weatherDescriptions = { 0: "Clear skies", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Foggy", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers", 95: "Thunderstorms" };

async function fetchTemperature() {
  try {
    // 1. Fetch data from the API
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    const data = await response.json();
    
    // 2. Extract the current temperature from the JSON structure
    const current = data.current;
    document.getElementById('temperatureDisplay').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('feelsLikeDisplay').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('windDisplay').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('humidityDisplay').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('weatherDescription').textContent = weatherDescriptions[current.weather_code] || "Changing skies";
    document.getElementById('weatherHighLow').textContent = `${Math.round(data.daily.temperature_2m_max[0])}° / ${Math.round(data.daily.temperature_2m_min[0])}°`;
    document.getElementById('weatherSymbol').textContent = current.weather_code === 0 ? "☀" : current.weather_code >= 51 ? "☂" : "☁";
    document.getElementById('forecastList').innerHTML = data.daily.time.slice(1).map((date, index) => `<div class="forecast-row"><span>${new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span><strong>${Math.round(data.daily.temperature_2m_max[index + 1])}°</strong><span>${Math.round(data.daily.temperature_2m_min[index + 1])}°</span></div>`).join('');
    document.getElementById('weatherUpdated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('temperatureDisplay').textContent = "--°C";
    document.getElementById('weatherDescription').textContent = "Weather unavailable";
  }
}

// Execute the function when the script loads
fetchTemperature();
setInterval(fetchTemperature, 15 * 60 * 1000);


// Make the DIV element draggable:
["notebookWindow", "embedPlaylistWindow", "galleryWindow"].forEach((id) => {
  const element = document.getElementById(id);
  if (element) dragElement(element);
});

function dragElement(element) {
  if (!element || element.dataset.dragInitialized === "true") return;

  const handle = element.querySelector(".windowHandle") || document.getElementById(element.id + "Handler");
  if (!handle) return;

  let startPointerX = 0;
  let startPointerY = 0;
  let startElementLeft = 0;
  let startElementTop = 0;

  handle.onpointerdown = function (event) {
    if (event.button !== 0) return;

    event.preventDefault();
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    startElementLeft = element.offsetLeft || 0;
    startElementTop = element.offsetTop || 0;
    handle.setPointerCapture(event.pointerId);
    handle.style.cursor = "grabbing";
    handle.onpointermove = drag;
    handle.onpointerup = stopDrag;
    handle.onpointercancel = stopDrag;
  };

  function drag(event) {
    event.preventDefault();
    const dx = event.clientX - startPointerX;
    const dy = event.clientY - startPointerY;
    element.style.left = `${startElementLeft + dx}px`;
    element.style.top = `${startElementTop + dy}px`;
  }

  function stopDrag(event) {
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
    handle.style.cursor = "move";
    handle.onpointermove = null;
    handle.onpointerup = null;
    handle.onpointercancel = null;
  }

  element.dataset.dragInitialized = "true";
}

var topBar = document.querySelector("#top");
var welcomeScreen = document.querySelector("#welcome");
var notebookWindow = document.querySelector("#notebookWindow");
var embedPlaylistWindow = document.querySelector("#embedPlaylistWindow");
var galleryWindow = document.querySelector("#galleryWindow");
var outsideView = document.querySelector("#outsideView");
var outsideIcon = document.querySelector("#outsideIcon");
var outsideClose = document.querySelector("#outsideClose");
var outsideAudio = document.querySelector("#waterfall");
var outsideSettingsToggle = document.querySelector("#outsideSettingsToggle");
var outsideSettings = document.querySelector("#outsideSettings");
var locationMenu = document.querySelector("#locationMenu");
var locationButtons = document.querySelectorAll("[data-location]");
var audioToggle = document.querySelector("#audioToggle");
var audioVolume = document.querySelector("#audioVolume");

var outsideLocations = {
  "moonlit-lake": "url(https://images7.alphacoders.com/134/thumb-1920-1342753.png)",
  "wildflower-meadow": "url(https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2400&q=85)",
  "misty-mountains": "url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85)"
};

function setOutsideLocation(locationName) {
  var backgroundImage = outsideLocations[locationName];
  if (!backgroundImage) return;
  document.body.style.setProperty("--outside-background", backgroundImage);
  if (outsideView) outsideView.style.setProperty("--outside-background", backgroundImage);
  locationButtons.forEach((button) => button.classList.toggle("selected", button.dataset.location === locationName));
}

if (outsideSettingsToggle && outsideSettings) {
  outsideSettingsToggle.addEventListener("click", () => {
    var isOpen = !outsideSettings.hidden;
    outsideSettings.hidden = isOpen;
    outsideSettingsToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  locationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setOutsideLocation(button.dataset.location);
    });
  });
}

if (outsideAudio && audioToggle && audioVolume) {
  outsideAudio.volume = Number(audioVolume.value);
  audioToggle.addEventListener("click", () => {
    if (outsideAudio.paused) {
      outsideAudio.play().catch((error) => console.warn("Outside audio could not start:", error));
    } else {
      outsideAudio.pause();
    }
    audioToggle.textContent = outsideAudio.paused ? "play" : "pause";
  });
  audioVolume.addEventListener("input", () => {
    outsideAudio.volume = Number(audioVolume.value);
  });
  outsideAudio.addEventListener("play", () => { audioToggle.textContent = "pause"; });
  outsideAudio.addEventListener("pause", () => { audioToggle.textContent = "play"; });
}

function setOutsideView(isOpen) {
  document.body.classList.toggle("outside-open", isOpen);
  if (outsideView) outsideView.setAttribute("aria-hidden", String(!isOpen));

  if (outsideAudio) {
    if (isOpen) {
      outsideAudio.play().catch((error) => console.warn("Outside audio could not start:", error));
    } else {
      outsideAudio.pause();
      outsideAudio.currentTime = 0;
      if (audioToggle) audioToggle.textContent = "play";
    }
  }
}

if (outsideIcon && outsideClose) {
  outsideIcon.addEventListener("click", () => setOutsideView(true));
  outsideClose.addEventListener("click", () => setOutsideView(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOutsideView(false);
  });
}

function closeWindow(element) {
  element.style.display = "none";
}
function openWindow(element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
  if (element.parentElement) element.parentElement.style.zIndex = biggestIndex;
    if (topBar) topBar.style.zIndex = biggestIndex + 1; // Ensure the top bar is always above the windows
}

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
  if (element.parentElement) element.parentElement.style.zIndex = biggestIndex;
  if (topBar) topBar.style.zIndex = biggestIndex + 1;
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

  if (slides.length === 0) return;
  if (n >= slides.length) {slideIndex = 0}
  if (n < 0) {slideIndex = slides.length - 1}

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.style.transform = `translateX(${-slideIndex * 100}%)`;
  }

  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[slideIndex]) {
    dots[slideIndex].classList.add("active");
  }

  const captions = ["Image 1", "Image 2", "Image 3"];
  const captionElement = document.querySelector(".imageCaption");
  if (captionElement) {
    captionElement.textContent = captions[slideIndex] || "Image";
  }
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
const gradeResult = document.getElementById("result");

if (rowsContainer && addRowButton && calculateButton && gradeResult) {
  function createRow() {
    const row = document.createElement("div");
    row.classList.add("row");

    row.innerHTML = `
      <input type="number" min="0" max="100" step="0.1" placeholder="e.g. 85" class="scoreInput" aria-label="Assignment grade">
      <input type="number" min="0" max="100" step="0.1" placeholder="e.g. 20" class="weightInput" aria-label="Assignment weight">
      <button class="removeRowButton" type="button" aria-label="Remove assignment">remove</button>
    `;

    rowsContainer.appendChild(row);

    row.querySelector(".removeRowButton").addEventListener("click", () => {
      row.remove();
      calculateFinalGrade();
    });

    row.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", calculateFinalGrade);
    });
  }

  function calculateFinalGrade() {
    const scoreInputs = document.querySelectorAll(".scoreInput");
    const weightInputs = document.querySelectorAll(".weightInput");

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (let i = 0; i < scoreInputs.length; i++) {
      const score = parseFloat(scoreInputs[i].value);
      const weight = parseFloat(weightInputs[i].value);

      if (isNaN(score) || isNaN(weight)) continue;

      totalWeightedScore += score * weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) {
      gradeResult.textContent = "Enter at least one grade and weight.";
      gradeResult.className = "grade-result grade-error";
    } else {
      const average = totalWeightedScore / totalWeight;
      const weightNote = totalWeight === 100 ? "Weights total 100%." : `Weights entered: ${totalWeight.toFixed(1)}%.`;
      gradeResult.textContent = `Weighted average: ${average.toFixed(2)}%. ${weightNote}`;
      gradeResult.className = "grade-result grade-success";
    }
  }

  for (let i = 0; i < 3; i++) {
    createRow();
  }

  addRowButton.addEventListener("click", createRow);
  calculateButton.addEventListener("click", calculateFinalGrade);
  calculateFinalGrade();
}

const notebookCells = document.querySelector("#notebookCells");
const notebookStorageKey = "mythicalOS-notebook";

if (notebookCells) {
  const defaultCells = [
    { type: "markdown", source: "# My notebook\n\nA small place to think, sketch, and test ideas." },
    { type: "code", source: "const message = 'Hello from your notebook';\nmessage;" }
  ];

  function saveNotebook() {
    const cells = [...notebookCells.querySelectorAll(".notebook-cell")].map((cell) => ({ type: cell.dataset.type, source: cell.querySelector("textarea").value }));
    localStorage.setItem(notebookStorageKey, JSON.stringify(cells));
    document.querySelector("#notebookSaveState").textContent = "saved locally";
  }

  function renderMarkdown(source) {
    return source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h2>$1</h2>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }

  function renumberCells() {
    notebookCells.querySelectorAll(".cell-number").forEach((number, index) => { number.textContent = String(index + 1).padStart(2, "0"); });
  }

  function addNotebookCell(type, source = "") {
    const cell = document.createElement("section");
    cell.className = "notebook-cell";
    cell.dataset.type = type;
    cell.innerHTML = `<div class="cell-gutter"><span class="cell-number"></span><span class="cell-dot"></span></div><div class="cell-content"><div class="cell-meta"><span>${type === "code" ? "JavaScript" : "Markdown"}</span><button type="button" class="remove-cell" aria-label="Remove cell">remove</button></div><textarea aria-label="${type} cell"></textarea><div class="cell-output" hidden></div></div>`;
    notebookCells.appendChild(cell);
    const textarea = cell.querySelector("textarea");
    textarea.value = source;
    textarea.addEventListener("input", () => {
      document.querySelector("#notebookSaveState").textContent = "saving...";
      saveNotebook();
      if (type === "markdown") cell.querySelector(".cell-output").innerHTML = renderMarkdown(textarea.value);
    });
    cell.querySelector(".remove-cell").addEventListener("click", () => { cell.remove(); renumberCells(); saveNotebook(); });
    if (type === "markdown") cell.querySelector(".cell-output").innerHTML = renderMarkdown(source);
    renumberCells();
  }

  function runCell(cell) {
    const output = cell.querySelector(".cell-output");
    output.hidden = false;
    try {
      const result = Function(cell.querySelector("textarea").value)();
      output.textContent = result === undefined ? "Ran successfully" : String(result);
      output.className = "cell-output success";
    } catch (error) {
      output.textContent = error.message;
      output.className = "cell-output error";
    }
  }

  function loadNotebook() {
    let cells = defaultCells;
    try { cells = JSON.parse(localStorage.getItem(notebookStorageKey)) || defaultCells; } catch (error) { cells = defaultCells; }
    cells.forEach((cell) => addNotebookCell(cell.type, cell.source));
  }

  document.querySelector("#addMarkdownCell").addEventListener("click", () => addNotebookCell("markdown"));
  document.querySelector("#addCodeCell").addEventListener("click", () => addNotebookCell("code"));
  document.querySelector("#runAllCells").addEventListener("click", () => notebookCells.querySelectorAll('[data-type="code"]').forEach(runCell));
  document.querySelector("#exportNotebook").addEventListener("click", () => {
    saveNotebook();
    const cells = [...notebookCells.querySelectorAll(".notebook-cell")].map((cell) => ({ cell_type: cell.dataset.type === "code" ? "code" : "markdown", metadata: { language: cell.dataset.type === "code" ? "javascript" : "markdown" }, source: cell.querySelector("textarea").value.split("\n") }));
    const file = new Blob([JSON.stringify({ cells }, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "mythical-notebook.ipynb";
    link.click();
    URL.revokeObjectURL(link.href);
  });
  loadNotebook();
}

let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;

  const currentDisplay = document.getElementById('currentDisplay') || document.getElementById('current');
  const previousDisplay = document.getElementById('previousDisplay') || document.getElementById('previous');

  function updateDisplay() {
    if (!currentDisplay || !previousDisplay) return;
    currentDisplay.textContent = currentOperand;
    previousDisplay.textContent = previousOperand
      ? `${previousOperand} ${operation || ''}`
      : '';
  }

  function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      currentOperand = number;
    } else {
      currentOperand += number;
    }
    updateDisplay();
  }

  function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
  }

  function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(curr)) return;

    switch (operation) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        result = curr === 0 ? 'Error' : prev / curr;
        break;
      case '%':
        result = prev % curr;
        break;
      case '^':
        result = Math.pow(prev, curr);
        break;
      default:
        return;
    }

    currentOperand = result.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
  }

  function compute() {
    calculate();
  }

  function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
  }

  function deleteLast() {
    if (currentOperand.length === 1) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+') chooseOperation('+');
    if (e.key === '-') chooseOperation('-');
    if (e.key === '*') chooseOperation('×');
    if (e.key === '/') { e.preventDefault(); chooseOperation('÷'); }
    if (e.key === '^') chooseOperation('^');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearAll();
  });

  const input = document.getElementById('cmd-input');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

let commandHistory = [];
let historyIndex = -1;

// Define your available commands here
const commands = {
  help: () => `Available commands: help, about, clear, echo, date, whoami`,
  about: () => `This is a custom web-based terminal built with HTML/CSS/JS.`,
  date: () => new Date().toString(),
  whoami: () => `guest`,
  echo: (args) => args.join(' '),
  clear: () => { output.innerHTML = ''; return null; }
};

function printLine(text) {
  const line = document.createElement('div');
  line.textContent = text;
  output.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  printLine(`guest@web:~$ ${trimmed}`);

  const [cmd, ...args] = trimmed.split(' ');
  const handler = commands[cmd.toLowerCase()];

  if (handler) {
    const result = handler(args);
    if (result !== null && result !== undefined) printLine(result);
  } else {
    printLine(`Command not found: ${cmd}. Type 'help' for a list of commands.`);
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleCommand(input.value);
    commandHistory.push(input.value);
    historyIndex = commandHistory.length;
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = '';
    }
    e.preventDefault();
  }
});

// Keep focus on input no matter where user clicks in the terminal
terminal.addEventListener('click', () => input.focus());

printLine('Welcome! Type "help" to see available commands.');