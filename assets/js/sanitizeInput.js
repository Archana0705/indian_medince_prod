// 🌐 Global Sanitization Function
window.sanitizeInput = (input) => {
    if (typeof input !== "string") return input;

    input = input.trim();
    input = input.replace(/<[^>]*>/g, "");
    input = input.replace(/(javascript:|data:|vbscript:)/gi, "");
    input = input.replace(/\son\w+="[^"]*"/gi, "");
    input = input.replace(/\son\w+='[^']*'/gi, "");
    input = input.replace(/[^a-zA-Z0-9\s.,\-']/g, ""); // only safe characters

    return input;
};

// 🚫 Pattern for allowed characters
const allowedPattern = /^[a-zA-Z0-9\s.,\-']*$/;

// 🧹 Remove disallowed chars & show inline error in real-time
$(document).on("input", 'input[type="text"], textarea', function (e) {
    const originalValue = $(this).val();
    if (!allowedPattern.test(originalValue)) {
        // Sanitize immediately
        const sanitized = window.sanitizeInput(originalValue);
        $(this).val(sanitized);

        // Remove any old error message
        $(this).next(".input-error").remove();

        // Add a new inline error message
        $(this).after(
            // `<div class="input-error" style="color:red;font-size:12px;">Invalid character removed.</div>`,
            showErrorToast("Input contained invalid characters and was sanitized.")
        );

        // Remove the message after 2 seconds
        setTimeout(() => {
            $(this).next(".input-error").fadeOut(300, function () {
                $(this).remove();
            });
        }, 2000);
    }
});

// 🧾 On submit, sanitize all text inputs again before sending
$(document).on("submit", "form", function () {
    $(this)
        .find('input[type="text"], textarea')
        .each(function () {
            const sanitized = window.sanitizeInput($(this).val());
            $(this).val(sanitized);
        });
});
