// console.log('globalHeader.js loaded');

// document.addEventListener('DOMContentLoaded', async function () {
//     console.log('DOMContentLoaded triggered');

//     try {
//         const headerPath = getAssetPath('globalHeader.html');
//         const response = await fetch(headerPath);
//         console.log('Fetching globalHeader.html – Status:', response.status);

//         if (!response.ok) throw new Error('Header file not found');

//         const html = await response.text();
//         console.log('Header HTML fetched successfully');

//         const container = document.getElementById('globalHeader');
//         if (container) {
//             container.innerHTML = html;
//             console.log('Header injected into #globalHeader');


//               // Dynamically add Logout button if not present
//               const navBar = container.querySelector('.t-NavigationBar'); // or correct header UL class
//               if (navBar && !navBar.querySelector('#logout')) {
//                 const logoutItem = document.createElement('li');
//                 logoutItem.className = 't-NavigationBar-item';
//                 logoutItem.id = 'logout';
//                 logoutItem.innerHTML = `
//                   <button class="t-Button t-Button--icon t-Button--header t-Button--navBar" type="button">
//                     <span class="t-Icon fa fa-user"></span>
//                     <span class="t-Button-label">Log Out</span>
//                     <span class="t-Button-badge"></span>
//                     <span class="a-Icon icon-down-arrow" aria-hidden="true"></span>
//                   </button>
//                 `;
//                 navBar.appendChild(logoutItem);
//                 console.log('Logout button dynamically added to header');
//               }

//               // Attach logout click handler (same logic you already have)
//               const logoutButton = container.querySelector('#logout');
//               if (logoutButton) {
//                 logoutButton.addEventListener('click', (e) => {
//                   e.preventDefault();
//                   console.log('Logout clicked from globalHeader');
//                   sessionStorage.clear();
//                   window.location.replace("../index.html"); // Prevent back navigation
//                 });
//               }



//             // Set username
//             const username = sessionStorage.getItem('userName') || 'User';
//             const usernameElement = document.getElementById('dynamicUsername');
//             if (usernameElement) {
//                 usernameElement.textContent = username;
//                 console.log('Username set:', username);
//             }

//             // --- Sign Out button ---
//             // const signOutBtn = document.getElementById('signOutBtn');
//             // if (signOutBtn) {
//             //     signOutBtn.addEventListener('click', function (e) {
//             //         e.preventDefault();
//             //         console.log('Sign out clicked');
//             //         sessionStorage.clear();

//             //         // Redirect to environment-based index.html
//             //         const basePath = getEnvBasePath();
//             //         const folder = getCurrentFolder();

//             //         // If inside /indian_medicine/amo/... → redirect to /indian_medicine/amo/index.html
//             //         // If directly inside /indian_medicine/... → redirect to /indian_medicine/index.html
//             //         const targetUrl = `${basePath}/index.html`;

//             //         console.log('Redirecting to:', targetUrl);
//             //         window.location.href = targetUrl;
//             //     });
//             // } 

//             const role = (sessionStorage.getItem('userRole') || '').toLowerCase();
//             const currentPage = window.location.pathname.toLowerCase();

//             console.log('userRole:', role);
//             console.log('currentPage:', currentPage);
//         } else {
//             console.warn('#globalHeader element not found in DOM');
//         }
//     } catch (error) {
//         console.error('Error during globalHeader init:', error);
//     }
// });

// // Header dropdown menu toggle
// document.addEventListener('click', function (event) {
//     const toggleBtn = document.querySelector('[data-menu="menu_L8804321173964414"]');
//     const menu = document.getElementById('menu_L8804321173964414');

//     if (!toggleBtn || !menu) return;

//     if (toggleBtn.contains(event.target)) {
//         const isVisible = menu.style.display === 'block';
//         menu.style.display = isVisible ? 'none' : 'block';
//         console.log(`Menu toggled: ${isVisible ? 'hide' : 'show'}`);
//     } else if (!menu.contains(event.target)) {
//         menu.style.display = 'none';
//         console.log('Menu hidden (outside click)');
//     }
// });

// /* ---------------------------
//    Helpers
// ---------------------------- */
// function getAssetPath(fileName) {
//     const parts = window.location.pathname.split('/').filter(Boolean);

//     // If inside a subfolder like /amo/home.html → use ../assets
//     if (parts.length > 1) {
//         return `../assets/partials/${fileName}`;
//     }
//     return `assets/partials/${fileName}`;
// }

// // function getEnvBasePath() {
// //     const host = window.location.hostname;

// //     // Staging (local or internal IP)
// //     if (host.includes('192.168') || host.includes('localhost')) {
// //         return 'http://192.168.5.247/indian_medicine';
// //     }

// //     // Production
// //     return 'https://indianmedicine.tn.gov.in';
// // }

// function getEnvBasePath() {
//     const host = window.location.hostname;

//     // Local / Internal IP
//     if (host.includes('192.168') || host.includes('localhost')) {
//         return 'http://192.168.5.247/indian_medicine';
//     }

//     // Staging
//     if (host.includes('tngis.tnega.org')) {
//         return 'https://tngis.tnega.org/indian_medicine';
//     }

//     // Production
//     return 'https://indianmedicine.tn.gov.in';
// }


// function getCurrentFolder() {
//     // Extracts folder like "amo", "admin", etc., but skips "indian_medicine"
//     const parts = window.location.pathname.split('/').filter(Boolean);
//     if (parts.length > 1 && parts[0].toLowerCase() === 'indian_medicine') {
//         return parts[1] || '';
//     }
//     return '';
// }


console.log('globalHeader.js loaded');

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOMContentLoaded triggered');

    try {
        const headerPath = getAssetPath('globalHeader.html');
        const response = await fetch(headerPath);
        console.log('Fetching globalHeader.html – Status:', response.status);

        if (!response.ok) throw new Error('Header file not found');

        const html = await response.text();
        console.log('Header HTML fetched successfully');

        const container = document.getElementById('globalHeader');
        if (container) {
            container.innerHTML = html;
            console.log('Header injected into #globalHeader');

            // ✅ Decrypt and get user session
            const session = window.getDecryptedUserSession();
            if (!session) {
                console.warn('⚠️ No user session found or decryption failed.');
                showErrorToast('Session expired or unauthorized access. Please log in again.');
                setTimeout(() => window.location.replace('../index.html'), 2000);
                return;
            }

            const userName = session.name || 'User';
            const userRole = session.role || 'Guest';
            const userDistrict = session.district || '';
            const userDesignation = session.designation || '';
            const userInstitution = session.institutionName || '';


            // 🧭 Inject logout button dynamically if not present
            const navBar = container.querySelector('.t-NavigationBar');
            if (navBar && !navBar.querySelector('#logout')) {
                const logoutItem = document.createElement('li');
                logoutItem.className = 't-NavigationBar-item';
                logoutItem.id = 'logout';
                logoutItem.innerHTML = `
          <button class="t-Button t-Button--icon t-Button--header t-Button--navBar" type="button">
            <span class="t-Icon fa fa-sign-out" aria-hidden="true"></span>
            <span class="t-Button-label">Log Out</span>
            <span class="t-Button-badge"></span>
          </button>
        `;
                navBar.appendChild(logoutItem);
                console.log('Logout button dynamically added to header');
            }

            // 🚪 Logout handler (clear only loginTime and userSession)
            // const logoutButton = container.querySelector('#logout');
            // if (logoutButton) {
            //     logoutButton.addEventListener('click', (e) => {
            //         e.preventDefault();
            //         console.log('Logout clicked from globalHeader');
            //         sessionStorage.removeItem('loginTime');
            //         localStorage.removeItem('userSession'); // Clear encrypted session
            //         window.location.replace('../index.html'); // Prevent back navigation
            //     });
            // }

            // 🚪 Logout handler with API call + full session clear
            const logoutButton = container.querySelector('#logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    console.log('Logout clicked from globalHeader');

                    const apiUrl = `${BASE_API_URL}/commonfunction`;
                    const payload = {
                        action: "logout",
                        function_name: "",
                        params: {}
                    };

                    try {
                        $.ajax({
                            url: apiUrl,
                            method: "POST",
                            data: { data: encryptData(payload) },
                            dataType: "json",
                            cache: false,
                            success() {
                                showSuccessToast("Logged out successfully");

                                // 🧹 Clear all session data (same as your old logic)
                                sessionStorage.clear();
                                localStorage.removeItem('userSession');

                                // 🔄 Redirect after logout
                                setTimeout(() => {
                                    window.location.replace("../index.html");
                                }, 1000);
                            },
                            error(xhr) {
                                console.error("Logout API failed:", xhr.responseText);
                                alert("Logout failed. Please try again.");
                            },
                        });
                    } catch (error) {
                        console.error("Logout error:", error);
                    }
                });
            }

            // 👤 Display username in header
            const usernameElement = document.getElementById('dynamicUsername');
            if (usernameElement) {
                usernameElement.textContent = userName;
                // console.log('Username set:', userName);
            }



        } else {
            console.warn('#globalHeader element not found in DOM');
        }
    } catch (error) {
        console.error('Error during globalHeader init:', error);
    }
});


// ======================= MENU TOGGLE =======================
document.addEventListener('click', function (event) {
    const toggleBtn = document.querySelector('[data-menu="menu_L8804321173964414"]');
    const menu = document.getElementById('menu_L8804321173964414');

    if (!toggleBtn || !menu) return;

    if (toggleBtn.contains(event.target)) {
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        console.log(`Menu toggled: ${isVisible ? 'hide' : 'show'}`);
    } else if (!menu.contains(event.target)) {
        menu.style.display = 'none';
        console.log('Menu hidden (outside click)');
    }
});


// ======================= HELPERS =======================
function getAssetPath(fileName) {
    const parts = window.location.pathname.split('/').filter(Boolean);

    // If inside a subfolder like /amo/home.html → use ../assets
    if (parts.length > 1) {
        return `../assets/partials/${fileName}`;
    }
    return `assets/partials/${fileName}`;
}

function getEnvBasePath() {
    const host = window.location.hostname;

    if (host.includes('192.168') || host.includes('localhost')) {
        return 'http://192.168.5.247/indian_medicine';
    }
    if (host.includes('tngis.tnega.org')) {
        return 'https://tngis.tnega.org/indian_medicine';
    }
    return 'https://indianmedicine.tn.gov.in';
}

function getCurrentFolder() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 1 && parts[0].toLowerCase() === 'indian_medicine') {
        return parts[1] || '';
    }
    return '';
}

// ======================= MOBILE: Accessibility toolbar (A-, A+, dark mode) as toggle =======================
(function initGigwMobileToggle() {
    function setupGigwToggle() {
        var gigw = document.querySelector('.t-Header .gigw');
        if (!gigw || gigw.querySelector('.gigw-mobile-trigger')) return;

        var trigger = document.createElement('li');
        trigger.className = 'gigw-mobile-trigger';
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-label', 'Accessibility options');
        trigger.innerHTML = '<a href="#" onclick="return false;"><span class="d-inline-block">Aa</span></a>';
        gigw.insertBefore(trigger, gigw.firstChild);

        var isMobile = function () { return window.matchMedia('(max-width: 767.98px)').matches; };
        if (isMobile()) gigw.classList.add('gigw--collapsed');

        trigger.querySelector('a').addEventListener('click', function (e) {
            e.preventDefault();
            if (!isMobile()) return;
            gigw.classList.toggle('gigw--collapsed');
        });

        document.addEventListener('click', function (e) {
            if (!isMobile()) return;
            if (!gigw.contains(e.target)) gigw.classList.add('gigw--collapsed');
        });
        window.addEventListener('resize', function () {
            if (!isMobile()) gigw.classList.remove('gigw--collapsed');
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupGigwToggle);
    } else {
        setupGigwToggle();
    }
})();

