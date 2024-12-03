// Function to toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const burgerMenu = document.getElementById("menu-btn");
    sidebar.classList.toggle("visible");
    burgerMenu.classList.toggle("active");
}

// Function to load notifications from localStorage
function loadNotifications() {
    const notificationsSection = document.getElementById("notifications");
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let unreadCount = 0;

    notificationsSection.innerHTML = '';

    if (notifications.length === 0) {
        const noNotificationsElement = document.createElement("div");
        noNotificationsElement.classList.add("no-notifications");
        noNotificationsElement.textContent = "No notifications yet!";
        notificationsSection.appendChild(noNotificationsElement);
    } else {
        notifications.forEach(notification => {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("notification", notification.category);

            // Check if the notification is unread
            if (!notification.read) {
                unreadCount++;
            }

            notificationElement.innerHTML = `
                <div class="notification-header" onclick="toggleNotificationDetails('${notification.id}')">
                    <span class="title">${notification.title}</span>
                    <span class="timestamp">${formatTimestamp(notification.timestamp)}</span>
                </div>
                <div class="notification-details hidden" id="details-${notification.id}">
                    <p>${notification.details}</p>
                    <button class="delete-btn" onclick="deleteNotification('${notification.id}')">❌ Delete</button>
                </div>
            `;
            notificationsSection.appendChild(notificationElement);
        });
    }

    // Update unread count on the sidebar
    const unreadBadge = document.getElementById("unread-count");
    unreadBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    unreadBadge.textContent = unreadCount;
}

// Function to format timestamps into readable format
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
}

// Function to delete a specific notification
function deleteNotification(id) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    loadNotifications();
}

// Function to clear all notifications
function clearAllNotifications() {
    const confirmation = confirm("Are you sure you want to clear all notifications?");
    if (confirmation) {
        localStorage.removeItem("notifications");
        loadNotifications();
    }
}

// Function to filter notifications based on search and category
function filterNotifications() {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    const categoryFilter = document.getElementById("category-filter").value;

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchQuery) || notification.details.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryFilter ? notification.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    loadFilteredNotifications(filteredNotifications);
}

// Function to display filtered notifications
function loadFilteredNotifications(filteredNotifications) {
    const notificationsSection = document.getElementById("notifications");
    notificationsSection.innerHTML = '';

    if (filteredNotifications.length === 0) {
        const noNotificationsElement = document.createElement("div");
        noNotificationsElement.classList.add("no-notifications");
        noNotificationsElement.textContent = "No matching notifications!";
        notificationsSection.appendChild(noNotificationsElement);
    } else {
        filteredNotifications.forEach(notification => {
            const notificationElement = document.createElement("div");
            notificationElement.classList.add("notification", notification.category);
            notificationElement.innerHTML = `
                <div class="notification-header" onclick="toggleNotificationDetails('${notification.id}')">
                    <span class="title">${notification.title}</span>
                    <span class="timestamp">${formatTimestamp(notification.timestamp)}</span>
                </div>
                <div class="notification-details hidden" id="details-${notification.id}">
                    <p>${notification.details}</p>
                    <button class="delete-btn" onclick="deleteNotification('${notification.id}')">❌ Delete</button>
                </div>
            `;
            notificationsSection.appendChild(notificationElement);
        });
    }
}

window.onload = function () {
    loadNotifications();
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", toggleSidebar);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById("sidebar");
        const burgerMenu = document.getElementById("menu-btn");
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnBurgerMenu = burgerMenu.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnBurgerMenu && sidebar.classList.contains("visible")) {
            sidebar.classList.remove("visible");
            burgerMenu.classList.remove("active");
        }
    });
};
