// utils.js
window.createDownloadLink = function (content, mimeType, filename) {
    if (!content) return "N/A";

    try {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        if (base64Pattern.test(content.replace(/\s/g, ""))) {
            const blob = new Blob(
                [new Uint8Array(atob(content).split("").map(c => c.charCodeAt(0)))],
                { type: mimeType }
            );
            const url = URL.createObjectURL(blob);
            return `<a href="${url}" target="_blank" class="btn btn-sm btn-link">Download</a>`;
        }

        return `<a href="${content}" target="_blank" class="btn btn-sm btn-link">Download</a>`;
    } catch (error) {
        console.error("Error creating download link:", error);
        return "Invalid content";
    }
};
