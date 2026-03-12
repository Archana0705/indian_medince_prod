// // function initializeUserSession() {
// //     debugger
// //     const secretKey = 'V7gN4dY8pT2xB3kRz';
// //     const sampleUser = {
// //         user_id: 101,
// //         name: "John Doe",
// //         role: "edistrict_manager"
// //     };

// //     const encrypted = CryptoJS.AES.encrypt(JSON.stringify(sampleUser), secretKey).toString();
// //     localStorage.setItem('userDetails', encrypted);

// //     const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
// //     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
// //     const user = JSON.parse(decrypted);

// //     window.userSession = {
// //         userId: user.user_id,
// //         name: user.name,
// //         role: user.role
// //     };

// //     const userNameElement = document.querySelector('.t-Button-label');
// //     if (userNameElement) userNameElement.textContent = user.name;
// // }

// // // window.initializeUserSession = initializeUserSession;
// // export { initializeUserSession };


// async function initializeUserSession(mobnumber) {
//     debugger
//     return new Promise((resolve, reject) => {
//         console.log("mobile number", mobnumber);
//         const payload = {
//             action: "function_call",
//             function_name: "IM_USER_LOGIN_FN",
//             params: {
//                 mobnumber: parseInt(mobnumber),
//             }
//         };

//         const apiUrl = `${BASE_API_URL}/commonfunction`;

//         $.ajax({
//             url: apiUrl,
//             method: "POST",
//             headers: {
//                 'X-APP-Key': "edm",
//                 'X-APP-Name': "edm"
//             },
//             data: {
//                 data: encryptData(payload)
//             },
//             dataType: 'json',
//             cache: false,
//             success: function (response) {
//                 try {
//                     if (response && response.data) {
//                         var decryptedResponse = decryptData(response.data);

//                         if (!Array.isArray(decryptedResponse) || decryptedResponse.length === 0) {
//                             throw new Error("Invalid decrypted data format");
//                         }

//                         const decrypted = decryptedResponse[0];
//                         window.userSession = {
//                             // userId: decrypted.user_id,
//                             district: decrypted.district,
//                             role: decrypted.login_type || '',
//                             institutionName: decrypted.name_of_the_institution || '',
//                             system: decrypted.system || '',
//                             name: decrypted.name || '',
//                             designation: decrypted.designation || ''
//                         };

//                         // localStorage.setItem('userRole', decrypted.login_type || '');
//                         // localStorage.setItem('userDistrict', decrypted.district);
//                         // localStorage.setItem('userName', decrypted.name);
//                         // localStorage.setItem('userInstitutionName', decrypted.name_of_the_institution || '');
//                         // localStorage.setItem('userSystem', decrypted.system || '');
//                         // localStorage.setItem('userDesignation', decrypted.designation || '');


//                         sessionStorage.setItem('userRole', decrypted.login_type || '');
//                         sessionStorage.setItem('userDistrict', decrypted.district);
//                         sessionStorage.setItem('userName', decrypted.name);
//                         sessionStorage.setItem('userInstitutionName', decrypted.name_of_the_institution || '');
//                         sessionStorage.setItem('userSystem', decrypted.system || '');
//                         sessionStorage.setItem('userDesignation', decrypted.designation || '');

//                         // localStorage.setItem('userId', decrypted.user_id || '');

//                         // const userNameElement = document.querySelector('.t-Button-label');
//                         // if (userNameElement) userNameElement.textContent = decrypted.name;

//                         resolve();
//                     } else {
//                         console.error("Invalid response structure - missing data field");
//                         reject(new Error("Invalid response structure"));
//                     }
//                 } catch (error) {
//                     console.error("Error processing response:", error);
//                     reject(error);
//                 }
//             },
//             error: function (xhr, status, error) {
//                 console.error("API call failed:", {
//                     status: xhr.status,
//                     statusText: xhr.statusText,
//                     responseText: xhr.responseText,
//                     error: error
//                 });
//                 reject(new Error("API call failed"));
//             }
//         });
//     });
// }

// window.initializeUserSession = initializeUserSession;


async function initializeUserSession(mobnumber) {
    debugger;
    return new Promise((resolve, reject) => {
        console.log("mobile number", mobnumber);

        const payload = {
            action: "function_call",
            function_name: "im_user_login_fn",
            params: {
                mobnumber: parseInt(mobnumber),
            }
        };

        const apiUrl = `${BASE_API_URL}/commonfunction`;
        const secretKey = 'V7gN4dY8pT2xB3kRz'; // keep same key for encrypt/decrypt

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
            dataType: 'json',
            cache: false,
            success: function (response) {
                try {
                    if (response && response.data) {
                        const decryptedResponse = decryptData(response.data);

                        if (!Array.isArray(decryptedResponse) || decryptedResponse.length === 0) {
                            throw new Error("Invalid decrypted data format");
                        }

                        const decrypted = decryptedResponse[0];

                        // Create session object
                        const userSession = {
                            district: decrypted.district,
                            role: decrypted.login_type || '',
                            institutionName: decrypted.name_of_the_institution || '',
                            system: decrypted.system || '',
                            name: decrypted.name || '',
                            designation: decrypted.designation || '',
                            loginTime: new Date().getTime()
                        };

                        // ✅ Encrypt entire session object before saving
                        const encryptedSession = CryptoJS.AES.encrypt(JSON.stringify(userSession), secretKey).toString();
                        sessionStorage.setItem('userSession', encryptedSession);

                        // Optional: also store plain session for runtime access (not persistent)
                        window.userSession = userSession;

                        console.log("User session encrypted and stored successfully.", userSession);
                        resolve();
                    } else {
                        console.error("Invalid response structure - missing data field");
                        reject(new Error("Invalid response structure"));
                    }
                } catch (error) {
                    console.error("Error processing response:", error);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error("API call failed:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                reject(new Error("API call failed"));
            }
        });
    });
}

// ✅ Helper function to get decrypted session from sessionStorage
function getDecryptedUserSession() {
    const secretKey = 'V7gN4dY8pT2xB3kRz';
    const encryptedSession = sessionStorage.getItem('userSession');
    if (!encryptedSession) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedSession, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Failed to decrypt session data:", error);
        return null;
    }
}

// Make functions globally available
window.initializeUserSession = initializeUserSession;
window.getDecryptedUserSession = getDecryptedUserSession;
