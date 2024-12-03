// Function to load notifications and update unread count
function loadUnreadCount() {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let unreadCount = 0;

    // Count the unread notifications
    notifications.forEach(notification => {
        if (!notification.read) {
            unreadCount++;
        }
    });

    // Update unread count in the sidebar
    const unreadBadge = document.getElementById("unread-count");
    if (unreadCount > 0) {
        unreadBadge.style.display = 'inline-block'; // Show the badge
        unreadBadge.textContent = unreadCount;     // Display the unread count
    } else {
        unreadBadge.style.display = 'none';         // Hide the badge if no unread notifications
    }
}

// Function to mark a notification as read when clicked
function markAsRead(id) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications = notifications.map(notification => {
        if (notification.id === id) {
            notification.read = true; // Mark as read
        }
        return notification;
    });

    // Save the updated notifications to localStorage
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Reload the unread count
    loadUnreadCount();
}

// Call the loadUnreadCount on page load
window.onload = function () {
    loadUnreadCount(); // Initialize the unread count
};
