// Sidebar Toggle Functionality
const burgerMenu = document.getElementById("burger-menu");
const sidebar = document.getElementById("sidebar");

// Toggles the sidebar visibility
burgerMenu.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
    burgerMenu.classList.toggle("active"); // Adds animation to the burger menu
});

// Close sidebar when clicking outside
document.addEventListener("click", (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnBurgerMenu = burgerMenu.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnBurgerMenu && sidebar.classList.contains("visible")) {
        sidebar.classList.remove("visible");
        burgerMenu.classList.remove("active");
    }
});

// Device Management
const addDeviceForm = document.getElementById("add-device-form");
const devicesList = document.getElementById("devices-list");

// Load devices from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadDevicesFromStorage);

// Add a new notification
function addNotification(title, details, category) {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const newNotification = {
        id: Date.now().toString(),
        title,
        details,
        category,
        timestamp: Date.now(),
        read: false, // Mark as unread
    };
    notifications.push(newNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

// Add device
addDeviceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get device details
    const deviceName = document.getElementById("device-name").value.trim();
    const deviceType = document.getElementById("device-type").value;

    if (deviceName) {
        // Add device to local storage
        addDeviceToStorage({ name: deviceName, type: deviceType, status: "Off" });

        // Create a device card
        createDeviceCard(deviceName, deviceType, "Off");

        // Add notification for adding a device
        addNotification(
            "Device Added",
            `Device "${deviceName}" of type "${deviceType}" was added.`,
            "status"
        );

        // Reset form
        addDeviceForm.reset();
    } else {
        alert("Please enter a device name!");
    }
});

// Function to create a device card
function createDeviceCard(deviceName, deviceType, deviceStatus) {
    // Remove the "No devices added yet" message
    const noDevicesMessage = devicesList.querySelector("p");
    if (noDevicesMessage) noDevicesMessage.remove();

    const deviceCard = document.createElement("div");
    deviceCard.className = "device-card";

    deviceCard.innerHTML = `
        <div class="device-info">
            <span>${deviceName} (${deviceType})</span>
            <p>Status: <span class="device-status">${deviceStatus}</span></p>
        </div>
        <div class="device-controls">
            <button class="toggle-btn">${deviceStatus === "On" ? "Turn Off" : "Turn On"}</button>
            <input type="number" class="timer-input" placeholder="Timer (mins)" />
            <button class="remove-btn">Remove</button>
        </div>
        <ul class="log-list"></ul>
    `;

    // Device-specific controls
    const toggleBtn = deviceCard.querySelector(".toggle-btn");
    const timerInput = deviceCard.querySelector(".timer-input");
    const removeBtn = deviceCard.querySelector(".remove-btn");
    const logList = deviceCard.querySelector(".log-list");
    const deviceStatusSpan = deviceCard.querySelector(".device-status");

    let isOn = deviceStatus === "On";
    let timerId = null;

    // Toggle ON/OFF functionality
    toggleBtn.addEventListener("click", () => {
        isOn = !isOn;
        deviceStatusSpan.textContent = isOn ? "On" : "Off";
        toggleBtn.textContent = isOn ? "Turn Off" : "Turn On";
        const action = isOn ? "turned ON" : "turned OFF";
        logActivity(`${deviceName} ${action}`);
        addNotification(
            "Device Status Changed",
            `Device "${deviceName}" was ${action}.`,
            "status"
        );
        updateDeviceInStorage(deviceName, { status: isOn ? "On" : "Off" });
    });

    // Set Timer functionality
    timerInput.addEventListener("change", () => {
        if (timerId) clearTimeout(timerId); // Clear previous timer

        const minutes = parseInt(timerInput.value);
        if (minutes > 0 && isOn) {
            logActivity(`Timer set for ${deviceName} (${minutes} mins)`);
            timerId = setTimeout(() => {
                isOn = false;
                deviceStatusSpan.textContent = "Off";
                toggleBtn.textContent = "Turn On";
                logActivity(`Timer expired for ${deviceName}`);
                addNotification(
                    "Timer Expired",
                    `Timer expired for "${deviceName}".`,
                    "reminder"
                );
                updateDeviceInStorage(deviceName, { status: "Off" });
            }, minutes * 60 * 1000); // Convert minutes to milliseconds
        }
    });

    // Remove Device functionality
    removeBtn.addEventListener("click", () => {
        logActivity(`${deviceName} removed`);
        addNotification(
            "Device Removed",
            `Device "${deviceName}" was removed.`,
            "error"
        );
        deviceCard.remove();
        removeDeviceFromStorage(deviceName);

        // If no devices remain, show the "No devices added yet" message
        if (!devicesList.querySelector(".device-card")) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No devices added yet.";
            devicesList.appendChild(emptyMessage);
        }
    });

    // Log Activity function
    function logActivity(message) {
        const logItem = document.createElement("li");
        logItem.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logList.appendChild(logItem);
    }

    // Append the device card to the devices list
    devicesList.appendChild(deviceCard);
}

// LocalStorage Functions
function addDeviceToStorage(device) {
    const devices = JSON.parse(localStorage.getItem("devices")) || [];
    devices.push(device);
    localStorage.setItem("devices", JSON.stringify(devices));
}

function updateDeviceInStorage(deviceName, updatedData) {
    const devices = JSON.parse(localStorage.getItem("devices")) || [];
    const deviceIndex = devices.findIndex((device) => device.name === deviceName);
    if (deviceIndex > -1) {
        devices[deviceIndex] = { ...devices[deviceIndex], ...updatedData };
        localStorage.setItem("devices", JSON.stringify(devices));
    }
}

function removeDeviceFromStorage(deviceName) {
    let devices = JSON.parse(localStorage.getItem("devices")) || [];
    devices = devices.filter((device) => device.name !== deviceName);
    localStorage.setItem("devices", JSON.stringify(devices));
}

function loadDevicesFromStorage() {
    const devices = JSON.parse(localStorage.getItem("devices")) || [];
    if (devices.length > 0) {
        devices.forEach((device) => {
            createDeviceCard(device.name, device.type, device.status);
        });
    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No devices added yet.";
        devicesList.appendChild(emptyMessage);
    }
}
