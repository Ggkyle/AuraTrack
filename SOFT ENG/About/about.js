// Function to toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const burgerMenu = document.getElementById("menu-btn");
    sidebar.classList.toggle("visible");
    burgerMenu.classList.toggle("active");
}

// Add an event listener to close the sidebar when clicking outside of it
document.addEventListener("click", (event) => {
    const sidebar = document.getElementById("sidebar");
    const burgerMenu = document.getElementById("menu-btn");

    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnBurgerMenu = burgerMenu.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnBurgerMenu && sidebar.classList.contains("visible")) {
        sidebar.classList.remove("visible");
        burgerMenu.classList.remove("active");
    }
});

// Load sidebar toggle functionality on page load
window.onload = function () {
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", toggleSidebar);
    }
};
