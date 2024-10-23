const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');

function updateTimeDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// When popup opens, get current time from background
chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
    if (response) {
        updateTimeDisplay(response.time);
        updateButtons(response.isRunning);
    }
});

// Listen for time updates from background
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "timeUpdate") {
        updateTimeDisplay(request.time);
    }
});

function updateButtons(isRunning) {
    startButton.disabled = isRunning;
    pauseButton.disabled = !isRunning;
}

// Button event listeners
startButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "start" });
    updateButtons(true);
});

pauseButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "pause" });
    updateButtons(false);
});

stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stop" });
    updateButtons(false);
});