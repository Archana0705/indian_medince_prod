
$(document).ready(function () {
    const apiUrl = 'https://tngis.tnega.org/lcap_api/edm/v1/commonfunction';
    const userId = localStorage.getItem('userId');
    const mobnumber = localStorage.getItem('userMob');

    function encryptData(data) {
        const secretKey = "xmcK|fbngp@!71L$";
        const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString());
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        const combinedData = iv.concat(encrypted.ciphertext);
        return CryptoJS.enc.Base64.stringify(combinedData);
    }

    function decryptData(encryptedData) {
        const secretKey = "xmcK|fbngp@!71L$";
        const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString());
        const decodedData = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Hex);
        const iv = CryptoJS.enc.Hex.parse(decodedData.slice(0, 32));
        const ciphertext = CryptoJS.enc.Hex.parse(decodedData.slice(32));
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJSc.pad.Pkcs7,
        });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    }

    const profilePayload = {
        action: "function_call",
        function_name: "user_profile_fn",
        params: {
            p_mobile: mobnumber
        }
    };

    $.ajax({
        url: apiUrl,
        method: 'POST',
        headers: {
            'X-APP-Key': 'edm',
            'X-APP-Name': 'edm'
        },
        data: {
            data: encryptData(profilePayload)
        },
        dataType: 'json',
        success(response) {
            const decrypted = decryptData(response.data);
            console.log("Profile response:", decrypted);
            $('#P66_NAME').val(decrypted[0].name);
            $('#P66_MOBILE').val(decrypted[0].mobile);
            $('#P66_EMAIL').val(decrypted[0].email);
            $('#P51_DISTRICT_NAME').val(decrypted[0].district);

            const $dropdown = $('#P7_LOCATION');
            $dropdown.empty().append('<option value="" class="placeholder">--Select Taluk--</option>');
            decrypted.forEach(item => {
                $dropdown.append(`<option value="${item.taluk_name}">${item.taluk_name}</option>`);
            });
        },
        error(xhr, status, error) {
            console.error("Profile API Error:", error);
            alert("Failed to load profile data.");
        }
    });

    let selectedFilesGlobal = [];

    document.getElementById('profileFileInput').addEventListener('change', async function () {
        const files = this.files;
        const errorSpan = $('#profileFileInput_error_placeholder');
        errorSpan.text('');
        selectedFilesGlobal = [];

        if (!files || files.length === 0) {
            errorSpan.text("Please select a file.");
            return;
        }

        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2 MB

        const validFiles = Array.from(files).filter(file => {
            if (!validTypes.includes(file.type)) {
                errorSpan.text("Invalid file type. Allowed: PDF, JPG, JPEG.");
                return false;
            }
            if (file.size > maxSize) {
                errorSpan.text("File too large. Max size: 2MB.");
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const readAsBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result?.split(',')[1];
                if (!base64Data) return reject("Base64 conversion failed");
                resolve({
                    filename: file.name,
                    fileBase64: base64Data,
                    fileType: file.type,
                    fileSize: file.size,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        try {
            selectedFilesGlobal = await Promise.all(validFiles.map(readAsBase64));
            const preview = document.getElementById('profileFilePreviewList');
            preview.innerHTML = '';
            selectedFilesGlobal.forEach(file => {
                const div = document.createElement('div');
                div.innerText = `✔️ ${file.filename} (${(file.fileSize / 1024).toFixed(1)} KB)`;
                preview.appendChild(div);
            });
        } catch (error) {
            console.error("File processing error:", error);
            errorSpan.text("Could not read file.");
        }
    });

    document.getElementById('saveBtn').addEventListener('click', function (e) {
        e.preventDefault();

        if (!selectedFilesGlobal || selectedFilesGlobal.length === 0) {
            alert("Please upload a valid file.");
            return;
        }

        const uploadFile = selectedFilesGlobal[0];
        const name = $('#P66_NAME').val();
        const district = $('#P51_DISTRICT_NAME').val();
        const mobile = $('#P66_MOBILE').val();
        const email = $('#P66_EMAIL').val();
        const personal_mob = $('#P66_PERSONAL_MOBILE').val();
        const personal_email = $('#P66_PERSONAL_EMAIL').val();
        const emergency_contact = $('#P66_EMRGENCY_CONTACT').val();
        const personal_address = $('#P66_PERSONAL_ADDRESS').val();

        const payload = {
            action: "function_call",
            function_name: "upt_user_profile_fn",
            params: {
                // name,
                // district,
                // mobile,
                // updated_by: userId,
                // p_attachment: uploadFile.fileBase64,
                // p_file_name: uploadFile.filename,
                // p_mime_type: uploadFile.fileType,
                // p_created_by: userId,


                p_user_id: userId,
                p_name: name,
                p_district: district,
                p_mobile: mobile,
                p_email: email,
                p_photo: uploadFile.fileBase64,
                p_mime_type: uploadFile.fileType,
                p_file_name: uploadFile.filename,
                p_personal_address: personal_mob,
                p_personal_email: personal_email,
                p_personal_mobile: emergency_contact,
                p_emrgency_contact: personal_address,
                p_updated_by: userId
            }
        };

        $.ajax({
            url: apiUrl,
            method: 'POST',
            headers: {
                'X-APP-Key': 'edm',
                'X-APP-Name': 'edm'
            },
            data: {
                data: encryptData(payload)
            },
            dataType: 'json',
            success: function (response) {
                console.log("Profile saved:", response);
                showSuccessToast("Profile saved successfully!");
                selectedFilesGlobal = [];
                document.getElementById('profileFileInput').value = '';
                document.getElementById('profileFilePreviewList').innerHTML = '';
                $('#P66_PERSONAL_MOBILE').val('');
                $('#P66_PERSONAL_EMAIL').val('');
                $('#P66_EMRGENCY_CONTACT').val('');
                $('#P66_PERSONAL_ADDRESS').val('');
                $('#profile-overlay').hide();
            },
            error: function (xhr, status, err) {
                console.error("Save error:", err);
                alert("Profile save failed. Try again.");
            }
        });
    });

    $('#closeBtn').on('click', function () {
        $('#profile-overlay').hide();
    });
});
