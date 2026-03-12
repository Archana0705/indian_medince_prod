// session-guard.js
(function () {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function redirectToLogin() {
    sessionStorage.clear();
    window.location.replace("../index.html");
  }

  function getDecryptedUserSession() {
    try {
      const encryptedSession = sessionStorage.getItem("encryptedUserSession");

      console.log(encryptedSession);
      if (!encryptedSession) return null;
      return decryptData(encryptedSession);
    } catch (err) {
      console.error("Error decrypting user session:", err);
      return null;
    }
  }

  function isSessionExpired() {
    const loginTime = sessionStorage.getItem("loginTime");
    if (!loginTime) return true;
    const now = Date.now();
    return now - parseInt(loginTime, 10) > SESSION_TIMEOUT;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const session = getDecryptedUserSession();

    if (!session || !session.name || !session.role || isSessionExpired()) {
      showErrorToast("Session expired or unauthorized access. Please log in again.");
      redirectToLogin();
      return;
    }

    const userNameElement = document.getElementById("sessionUserName");
    if (userNameElement) userNameElement.textContent = session.name;
  });

  // Handles navigation back-cache reloads
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      const session = getDecryptedUserSession();
      if (!session || isSessionExpired()) redirectToLogin();
    }
  });

  // Optional: logout handler
  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        redirectToLogin();
      });
    }
  });
})();
