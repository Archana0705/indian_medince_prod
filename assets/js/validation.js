// validation.js

window.validation = {
    // Show error message
    showError: function (selector, message) {
        $(selector).after(`<div class="field-error" style="color:red;font-size:12px;">${message}</div>`);
        if (typeof showErrorToast === 'function') {
            showErrorToast(message);
        }
    },

    // Clear all field errors
    clearErrors: function () {
        $('.field-error').remove();
    },

    // Required field validation
    validateRequiredField: function (selector, value, fieldName) {
        if (!value?.trim()) {
            this.showError(selector, `${fieldName} is required.`);
            return false;
        }
        return true;
    },

    // 10-digit mobile number validation
    validateMobileNumber: function (selector, value) {
        if (!value || !/^\d{10}$/.test(value)) {
            this.showError(selector, 'Valid 10-digit mobile number is required.');
            return false;
        }
        return true;
    },

    // 12-digit Aadhaar number validation
    validateAadhaarNumber: function (selector, value) {
        if (!value || !/^\d{12}$/.test(value)) {
            this.showError(selector, 'Valid 12-digit Aadhar number is required.');
            return false;
        }
        return true;
    },

    // Numeric field validation
    validateNumericField: function (selector, value, fieldName) {
        if (!value || isNaN(value)) {
            this.showError(selector, `Valid ${fieldName} is required.`);
            return false;
        }
        return true;
    }
};
