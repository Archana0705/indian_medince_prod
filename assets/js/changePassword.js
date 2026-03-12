const userDetailsEncrypted = localStorage.getItem('userDetails');
const secretKey = 'V7gN4dY8pT2xB3kRz';
let userId = '';
if (userDetailsEncrypted) {
    const decrypted = CryptoJS.AES.decrypt(userDetailsEncrypted, secretKey).toString(CryptoJS.enc.Utf8);
    const user = JSON.parse(decrypted);
    userId = user.user_id;
}
function encryptData(data) {
    const secretKey = "xmcK|fbngp@!71L$";
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString()); // Derive 256-bit key
    const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
    });

    // Combine IV and ciphertext
    const combinedData = iv.concat(encrypted.ciphertext);

    // Return Base64 encoded result
    return CryptoJS.enc.Base64.stringify(combinedData);
    // return data;
}

// Decryption Function

function decryptData(encryptedData) {
    const secretKey = "xmcK|fbngp@!71L$"; // Same secret key
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString()); // Derive 256-bit key

    // Decode Base64 and split IV and ciphertext
    const decodedData = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Hex);
    const ivHex = decodedData.slice(0, 32); // First 16 bytes (IV)
    const cipherHex = decodedData.slice(32); // Remaining bytes (Ciphertext)

    const iv = CryptoJS.enc.Hex.parse(ivHex); // Parse IV
    const ciphertext = CryptoJS.enc.Hex.parse(cipherHex); // Parse Ciphertext

    // Decrypt using AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7, // Default padding
        }
    );

    // Convert decrypted data to a string
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}


$(document).on('click', '#changePasswordSubmit', function () {
    const apiUrl = "https://tngis.tnega.org/lcap_api/edm/v1/commonfunction";

    const confirmPassword = $('#Confirm_password_input').val();
    const newPassword = $('#New_password_input').val();

    if (!confirmPassword || !newPassword) {
        alert("Please fill all required fields");
        return;
    }

    const payload = {
        action: "function_call",
        function_name: "change_password_fn",
        params: {
            p_confirm_password: confirmPassword,
            p_user_id: userId
        }
    };

    $.ajax({
        url: apiUrl,
        method: "POST",
        headers: {
            'X-APP-Key': "edm",
            'X-APP-Name': "edm"
        },
        data: {
            data: encryptData(payload)
        },
        success: function () {
            alert("Password Changed Successfully");
            setTimeout(() => $('#popup-overlay').fadeOut(), 1000);
            $('.t-Header').css('z-index', '800');
        },
        error: function () {
            alert('Error occurred during password change');
        }
    });
});

$(document).on('click', '#close-popup, #popup-overlay', function () {
    $('#popup-overlay').fadeOut();
    $('.t-Header').css('z-index', '800');
});

$(document).on('click', '#popup-content', function (e) {
    e.stopPropagation();
});
