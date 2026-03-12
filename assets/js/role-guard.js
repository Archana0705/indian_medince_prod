// assets/js/role-guard.js
(function () {
    const ROLE_ACCESS = {
        amo: ["amo"],
        admin: ["admin"],
        commissioner: ["commissioner"],
        dim: ["dim"],
        dsmo: ["dsmo"],
        factory: ["factory"],
        nodal: ["nodal"],
    };

    function redirectToUnauthorized() {
        showErrorToast("Unauthorized access. Redirecting to login.");
        sessionStorage.clear();
        window.location.replace("../index.html");
    }

    function getUserRoleFromSession() {
        try {
            const session = window.getDecryptedUserSession?.();
            return session?.role?.toLowerCase() || null;
        } catch (err) {
            console.error("Role fetch failed:", err);
            return null;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const role = getUserRoleFromSession();

        // If no valid session or role → redirect
        if (!role) {
            redirectToUnauthorized();
            return;
        }

        // 🔍 Detect the current module folder (e.g., /amo/home.html → "amo")
        const pathParts = window.location.pathname.split("/");
        const currentFolder = pathParts.find((part) =>
            Object.keys(ROLE_ACCESS).includes(part)
        );

        // 🧠 Case 1: Folder not found → skip (maybe global pages)
        if (!currentFolder) return;

        // 🚫 Case 2: Mismatch → redirect to index.html
        if (!ROLE_ACCESS[role].includes(currentFolder)) {
            console.warn(
                `Unauthorized: role "${role}" cannot access "${currentFolder}". Redirecting...`
            );
            redirectToUnauthorized();
        }
    });
})();
