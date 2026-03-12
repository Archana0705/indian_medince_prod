// toastUtil.js

window.showSuccessToast = function (message) {
    const toastElement = document.getElementById('successToast');
    const toastBody = document.getElementById('successMessage');

    if (toastElement && toastBody) {
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
    } else {
        console.warn('Success toast layout not found in DOM.');
    }
};

window.showErrorToast = function (message) {
    const toastElement = document.getElementById('errorToast');
    const toastBody = document.getElementById('errorMessage');

    if (toastElement && toastBody) {
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
    } else {
        console.warn('Error toast layout not found in DOM.');
    }
};

window.loadToastLayout = function (callback) {
    const toastPath = getAssetPath('toastLayout.html');

    fetch(toastPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch toastLayout.html: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);
            console.log('Toast layout loaded from', toastPath);

            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(err => console.error('Toast layout load failed:', err));
};

// Ensure layout is loaded before any toast is shown
document.addEventListener('DOMContentLoaded', () => {
    loadToastLayout(() => {
        // Example test
        // showSuccessToast('Loaded successfully!');
    });
});

/* ---------------------------
   Reuse same helper as header
---------------------------- */
function getAssetPath(fileName) {
    const parts = window.location.pathname.split('/').filter(Boolean);

    // If inside a subfolder like /amo/home.html → use ../assets
    if (parts.length > 1) {
        return `../assets/partials/${fileName}`;
    }
    // If at root (e.g. /index.html) → use assets
    return `assets/partials/${fileName}`;
}
