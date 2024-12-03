// Select elements
const burgerMenu = document.getElementById("burger-menu");
const sidebar = document.getElementById("sidebar");
const startStopButton = document.getElementById("start-stop-btn");
const statusLabel = document.getElementById("status-label");
const timerDisplay = document.getElementById("timer-display");
const resetTimerButton = document.getElementById("reset-timer-btn");
const energySaved = document.getElementById("energy-saved");

// Variables for Timer and System State
let timer = null;
let elapsedTime = 0; // In seconds
let systemOn = false; // Tracks whether the system is on or off

// Toggle Sidebar
burgerMenu.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
    burgerMenu.classList.toggle("active"); // Adds animation to the burger menu
});

// Start/Stop System
startStopButton.addEventListener("click", () => {
    if (systemOn) {
        // Turn system off
        systemOn = false;
        clearInterval(timer);
        startStopButton.textContent = "Start";
        statusLabel.textContent = "Off";

        // Send a notification when stopping the system
        sendNotification(
            "Stopped",
            timerDisplay.textContent, // Elapsed Time
            energySaved.textContent // Energy Saved
        );
    } else {
        // Turn system on
        systemOn = true;
        startStopButton.textContent = "Stop";
        statusLabel.textContent = "On";
        startTimer();

        // Send a notification when starting the system
        sendNotification("Running", "00:00:00", "0.00 kWh");
    }
});

// Start Timer
function startTimer() {
    timer = setInterval(() => {
        elapsedTime++;
        updateTimerDisplay();
        updateEnergySavings();
    }, 1000); // Increment every second
}

// Update Timer Display
function updateTimerDisplay() {
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(elapsedTime % 60).padStart(2, "0");
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Reset Timer
resetTimerButton.addEventListener("click", () => {
    elapsedTime = 0;
    clearInterval(timer);
    updateTimerDisplay();
    updateEnergySavings();

    if (systemOn) {
        startTimer(); // Restart timer if the system is on
    }

    // Send a notification when resetting the timer
    sendNotification("Reset", "00:00:00", "0.00 kWh");
});

// Update Energy Savings
function updateEnergySavings() {
    const savingsPerSecond = 0.05 / 60; // 0.05 kWh per minute
    const totalSavings = (elapsedTime * savingsPerSecond).toFixed(2); // Round to 2 decimal places
    energySaved.textContent = `${totalSavings} kWh`;
}

// Close sidebar when clicking outside of it
document.addEventListener("click", (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnBurgerMenu = burgerMenu.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnBurgerMenu && sidebar.classList.contains("visible")) {
        sidebar.classList.remove("visible");
        burgerMenu.classList.remove("active"); // Reset burger menu animation
    }
});

// Send Notification to LocalStorage
function sendNotification(status, elapsedTime, energySaved) {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const newNotification = {
        id: `${Date.now()}`, // Unique ID
        title: `Status changed to ${status}`,
        details: `Elapsed Time: ${elapsedTime}, Energy Saved: ${energySaved}`,
        timestamp: Date.now() // Current time
    };
    notifications.push(newNotification); // Add to notifications array
    localStorage.setItem("notifications", JSON.stringify(notifications)); // Save to localStorage
}
