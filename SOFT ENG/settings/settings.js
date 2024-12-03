// Sidebar and Burger Menu Functionality
const sidebar = document.getElementById('sidebar');
const burgerMenu = document.getElementById('burger-menu');

burgerMenu.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
    burgerMenu.classList.toggle('active');
});

// Settings Functionality
const motionSensitivity = document.getElementById('motion-sensitivity');
const sensitivityValue = document.getElementById('sensitivity-value');
const notificationsToggle = document.getElementById('notifications-toggle');
const defaultDevice = document.getElementById('default-device');
const saveSettingsButton = document.getElementById('save-settings');

// Update Sensitivity Display
motionSensitivity.addEventListener('input', () => {
    sensitivityValue.textContent = motionSensitivity.value;
});

// Save Settings
saveSettingsButton.addEventListener('click', () => {
    const settings = {
        motionSensitivity: motionSensitivity.value,
        notificationsEnabled: notificationsToggle.checked,
        defaultDevice: defaultDevice.value,
    };

    fetch('http://localhost:3000/system/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    })
        .then((response) => response.json())
        .then((data) => {
            alert('Settings saved successfully!');
            console.log('Settings:', data);
        })
        .catch((error) => {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        });
});
