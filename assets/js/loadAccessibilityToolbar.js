document.addEventListener("DOMContentLoaded", function () {
    debugger
    const darkModeToggle = document.getElementById("darkModeToggle");
    const increaseFont = document.getElementById("increaseFont");
    const decreaseFont = document.getElementById("decreaseFont");

    // Load saved settings
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    const savedFont = localStorage.getItem("fontSizeClass");
    if (savedFont) {
        document.body.classList.add(savedFont);
    } else {
        document.body.classList.add("font-medium"); // default
    }

    // Toggle Dark Mode
    darkModeToggle?.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        const enabled = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
    });

    // Font Size Logic
    const fontClasses = ["font-small", "font-medium", "font-large"];
    function getCurrentFontIndex() {
        return fontClasses.findIndex(cls => document.body.classList.contains(cls));
    }

    function setFontSize(index) {
        document.body.classList.remove(...fontClasses);
        const clampedIndex = Math.max(0, Math.min(index, fontClasses.length - 1));
        document.body.classList.add(fontClasses[clampedIndex]);
        localStorage.setItem("fontSizeClass", fontClasses[clampedIndex]);
    }

    increaseFont?.addEventListener("click", function () {
        const currentIndex = getCurrentFontIndex();
        setFontSize(currentIndex + 1);
    });

    decreaseFont?.addEventListener("click", function () {
        const currentIndex = getCurrentFontIndex();
        setFontSize(currentIndex - 1);
    });
});
