window.onload = function () {
    // No background setup as per your changes.
};

document.getElementById('startBtn').addEventListener('click', function () {
    // Hide the button and start the countdown.
    this.style.display = 'none';
    startCountdown();
});

function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    let countdown = 3;

    // Display the countdown message.
    countdownElement.textContent = `AuraTrack starting in ${countdown}...`;

    const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = `AuraTrack starting in ${countdown}...`;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            navigateToInterface();
        }
    }, 1000); // Countdown interval of 1 second.
}

function navigateToInterface() {
    // Redirect to the `interface.html` in the same folder.
    window.location.href = 'interface/interface.html';
}
