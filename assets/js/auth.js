// auth.js
$(document).ready(function () {
    $("#signClick").on("click", async function (e) {
        e.preventDefault();

        const mobnumber = $("#P9999_USERNAME").val()?.trim();
        const password = $("#P9999_PASSWORD").val()?.trim();

        if (!mobnumber || !password) {
            alert("Please enter valid credentials.");
            return;
        }

        try {
            // 🔐 Initialize session with API validation
            await initializeUserSession(mobnumber);

            // 🕒 Set login timestamp
            sessionStorage.setItem("loginTime", Date.now().toString());

            // ✅ Redirect to home after successful login
            window.location.replace("./pages/home.html");
        } catch (err) {
            console.error("Login failed:", err);
            alert("Invalid user or system error. Please try again.");
        }
    });
});
