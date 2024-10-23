let timer;
let seconds = 1500; // 25 minutes in seconds
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (seconds > 0) {
                seconds--;
                chrome.storage.local.set({ 
                    remainingTime: seconds,
                    isRunning: isRunning
                });
                // Broadcast time update to any open popup
                chrome.runtime.sendMessage({ 
                    action: "timeUpdate", 
                    time: seconds 
                });
            } else {
                clearInterval(timer);
                isRunning = false;
                notifyUser();
                chrome.storage.local.set({ 
                    isRunning: false,
                    remainingTime: 1500 // Reset to default
                });
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        chrome.storage.local.set({ 
            isRunning: false,
            remainingTime: seconds
        });
    }
}

function resetTimer() {
    pauseTimer();
    seconds = 1500;
    chrome.storage.local.set({ 
        remainingTime: seconds,
        isRunning: false
    });
    chrome.runtime.sendMessage({ 
        action: "timeUpdate", 
        time: seconds 
    });
}

function notifyUser() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Pomodoro Timer',
        message: 'Time is up! Take a break.',
        priority: 2
    });
}

// Load saved state on startup
chrome.storage.local.get(['remainingTime', 'isRunning'], (data) => {
    if (data.remainingTime) {
        seconds = data.remainingTime;
    }
    if (data.isRunning) {
        startTimer();
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
        case "start":
            startTimer();
            break;
        case "pause":
            pauseTimer();
            break;
        case "stop":
            resetTimer();
            break;
        case "getTime":
            // Respond with current time when popup opens
            sendResponse({ 
                time: seconds,
                isRunning: isRunning 
            });
            break;
    }
    return true; // Required for async sendResponse
});