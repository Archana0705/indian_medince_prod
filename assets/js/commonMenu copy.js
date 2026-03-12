// assets/js/commonMenu.js
import { initializeUserSession } from "./auth.js";
// const userRole = "edistrict_manager";
const userRole = localStorage.getItem('userRole');
console.log("userRole", userRole)

const menuItems = [
    { label: "Home", file: "dashboard.html", folder: "", icon: "fa fa-tachometer", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "call-center-operator", "operator"] },
    {
        label: "All Requests", file: "allrequest.html", folder: "", icon: "fa fa-tasks", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "General Helpdesk Operator", "operator"],
        subMenu: [
            {
                label: "All Requests with Reassign Options",
                file: "request-reassign.html",
                folder: "",
                roles: ["helpdesk_operator"]
            }
        ]
    },
    { label: "New Requests", file: "new-request.html", folder: "", icon: "fa fa-plus-circle", roles: ["edistrict_manager", "helpdesk_operator", "general helpdesk operator", "operator"] },
    { label: "In Progress Requests", file: "inprogress-request.html", folder: "", icon: "fa fa-spinner", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    // { label: "On-Hold Requests", file: "onhold-request.html", folder: "", icon: "fa fa-pause-circle", roles: ["helpdesk", "helpdesk_operator"] },
    { label: "Resolved Requests", file: "resolved-request.html", folder: "", icon: "fa fa-check-circle", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    { label: "Closed Requests", file: "closed-request.html", folder: "", icon: "fa fa-times-circle", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    { label: "Reopened Requests", file: "re-opened-request.html", folder: "", icon: "fa fa-refresh", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    // { label: "Reassigned Requests", file: "reassigned-request.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk_operator"] },

    { label: "Operator Details", file: "operator-details.html", folder: "", icon: "fa fa-refresh", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    { label: "Diary for EDM Inspection Report", file: "dairy-for-inspection.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk_operator"] },
    { label: "EDM Instruction Report", file: "edm-instruction-request.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk_operator"] },
    // { label: "Overall EDM Report", file: "re-opened-request.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk", "helpdesk_operator"] },
    { label: "Instructions Received Report", file: "instructions-recieved-report.html", folder: "", icon: "fa fa-refresh", roles: ["edistrict_manager", "operator"] },
    { label: "Helpdesk Tickets", file: "helpdesk-report.html", folder: "", icon: "fa fa-refresh", roles: ["edistrict_manager", "operator"] },

    { label: "Ticket Updates", file: "allrequest.html", folder: "", icon: "fa fa-refresh", roles: ["call-center-operator"] },
    { label: "Ticket Raise Request", file: "ticket-updates.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk", "helpdesk_operator"] },

    { label: "Helpdesk Ticket Updates", file: "helpdesk-ticket-update.html", folder: "", icon: "fa fa-refresh", roles: ["helpdesk", "helpdesk_operator"] },
    {
        label: "Helpdesk Tickets Reports", file: "", folder: "", icon: "fa fa-list", roles: ["helpdesk", "helpdesk_operator", "call-center-operator"],
        subMenu: [
            {
                label: "Helpdesk Instruction Open Report ",
                file: "helpdeskopen.html",
                folder: "",

                roles: ["helpdesk_operator", "call-center-operator"]
            },
            {
                label: "Helpdesk Instruction In Progress Report ",
                file: "helpdesk-inprogress.html",
                folder: "",
                roles: ["helpdesk_operator", "call-center-operator"]
            },
            {
                label: "Helpdesk Instruction Closed Report ",
                file: "helpdesk-closed.html",
                folder: "",
                roles: ["helpdesk_operator", "call-center-operator"]
            },
            // {
            //     label: "Helpdesk Instruction Reassigned Report",
            //     file: "request-reassign.html",
            //     folder: "",
            //     roles: ["helpdesk_operator", "call-center-operator"]
            // }

        ]
    },

    { label: "eSevai Operator Change Request Form", file: "esevai-request-form.html", folder: "", icon: "fa fa-lock", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    { label: "eSevai Operator Change Request Report", file: "esevai-request-report.html", folder: "", icon: "fa fa-lock", roles: ["edistrict_manager", "helpdesk", "helpdesk_operator", "operator"] },
    { label: "Approved / Rejected Operator Change Report", file: "approve-reject-operator-request.html", folder: "", icon: "fa fa-lock", roles: ["helpdesk", "helpdesk_operator"] },
    { label: "Public Petitions", file: "publicpetitions.html", folder: "", icon: "fa fa-lock", roles: ["helpdesk", "helpdesk_operator"] },

];

function normalizeRole(role) {
    if (!role) return null;
    const lowerRole = role.toLowerCase();

    if (lowerRole.includes("general helpdesk operator")) {
        return "call-center-operator";
    }
    if (
        lowerRole.includes("helpdesk_operator")
    ) {
        return "helpdesk_operator";
    }
    if (lowerRole.includes("edistrict manager")) {
        return "edistrict_manager";
    }
    if (lowerRole.includes("operators")) return "operator";
    return null;
}


// function renderDynamicMenu(containerId) {
//     debugger
//     const ul = document.getElementById(containerId);
//     if (!ul) return;

//     const rawUserRole = localStorage.getItem('userRole');
//     const userRole = normalizeRole(rawUserRole);

//     const pathParts = window.location.pathname.split('/');
//     const currentFile = pathParts.pop();
//     const currentFolder = pathParts.pop();

//     const pageSpecificMenuRestrictions = {
//         "edm-diary.html": {
//             allowedRoles: ["edistrict_manager"],
//             allowedLabels: ["Home"]
//         },
//     };

//     let filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

//     if (pageSpecificMenuRestrictions[currentFile]) {
//         const restriction = pageSpecificMenuRestrictions[currentFile];
//         if (restriction.allowedRoles.includes(userRole)) {
//             filteredMenu = filteredMenu.filter(item =>
//                 restriction.allowedLabels.includes(item.label)
//             );
//         }
//     }

//     filteredMenu.forEach(item => {
//         const li = document.createElement("li");
//         li.classList.add("main-menu-item");

//         const a = document.createElement("a");
//         a.href = (item.folder === currentFolder || item.folder === "") ? item.file : `../${item.folder}/${item.file}`;
//         a.innerHTML = `<span class="${item.icon}" style="margin-right: 10px;"></span>${item.label}`;
//         li.appendChild(a);

//         // Handle submenu
//         if (item.subMenu && Array.isArray(item.subMenu)) {
//             const subItems = item.subMenu.filter(sub => sub.roles.includes(userRole));
//             if (subItems.length > 0) {
//                 // Add toggle button
//                 const toggleBtn = document.createElement("span");
//                 toggleBtn.innerHTML = "&#9660;"; // ▼ down arrow
//                 toggleBtn.classList.add("submenu-toggle");
//                 li.appendChild(toggleBtn);

//                 // Create submenu
//                 const subUl = document.createElement("ul");
//                 subUl.classList.add("submenu");

//                 subItems.forEach(sub => {
//                     const subLi = document.createElement("li");
//                     const subA = document.createElement("a");
//                     subA.href = (sub.folder === currentFolder || sub.folder === "") ? sub.file : `../${sub.folder}/${sub.file}`;
//                     subA.textContent = sub.label;
//                     subLi.appendChild(subA);
//                     subUl.appendChild(subLi);
//                 });

//                 li.appendChild(subUl);

//                 // Add event listener to toggle visibility
//                 toggleBtn.addEventListener("click", (e) => {
//                     e.preventDefault();
//                     subUl.classList.toggle("submenu-visible");
//                     toggleBtn.classList.toggle("rotated");
//                 });
//             }
//         }

//         ul.appendChild(li);
//     });
// }

function renderDynamicMenu(containerId) {
    debugger
    const ul = document.getElementById(containerId);
    if (!ul) return;

    const rawUserRole = localStorage.getItem('userRole');
    const userRole = normalizeRole(rawUserRole);

    const pathParts = window.location.pathname.split('/');
    const currentFile = pathParts.pop();
    const currentFolder = pathParts.pop();

    const pageSpecificMenuRestrictions = {
        "edm-diary.html": {
            allowedRoles: ["edistrict_manager"],
            allowedLabels: ["Home"]
        },
    };

    let filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    if (pageSpecificMenuRestrictions[currentFile]) {
        const restriction = pageSpecificMenuRestrictions[currentFile];
        if (restriction.allowedRoles.includes(userRole)) {
            filteredMenu = filteredMenu.filter(item =>
                restriction.allowedLabels.includes(item.label)
            );
        }
    }

    filteredMenu.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("main-menu-item");

        // Base styles
        li.style.padding = "10px";
        // li.style.borderBottom = "1px solid #ccc";
        li.style.cursor = "pointer";

        const itemHref = (item.folder === currentFolder || item.folder === "") ? item.file : `../${item.folder}/${item.file}`;

        const a = document.createElement("a");
        a.href = itemHref;
        a.innerHTML = `<span class="${item.icon}" style="margin-right: 10px;"></span>${item.label}`;
        a.style.textDecoration = "none";
        a.style.color = "#333";

        // Highlight if current page
        if (item.file === currentFile) {
            li.classList.add("active");
            li.style.backgroundColor = "#2083b2";
            a.style.color = "#fff";
            a.style.fontWeight = "bold";
        }

        li.appendChild(a);

        // Handle submenu
        if (item.subMenu && Array.isArray(item.subMenu)) {
            const subItems = item.subMenu.filter(sub => sub.roles.includes(userRole));
            if (subItems.length > 0) {
                const toggleBtn = document.createElement("span");
                toggleBtn.innerHTML = "&#9660;";
                toggleBtn.classList.add("submenu-toggle");
                toggleBtn.style.marginLeft = "10px";
                toggleBtn.style.cursor = "pointer";
                li.appendChild(toggleBtn);

                const subUl = document.createElement("ul");
                subUl.classList.add("submenu");
                subUl.style.marginTop = "10px";
                subUl.style.marginLeft = "20px";
                subUl.style.paddingLeft = "10px";
                subUl.style.borderLeft = "2px solid #ccc";
                subUl.style.display = "none"; // initially hidden

                let submenuActive = false;

                subItems.forEach(sub => {
                    const subLi = document.createElement("li");
                    const subA = document.createElement("a");
                    subA.href = (sub.folder === currentFolder || sub.folder === "") ? sub.file : `../${sub.folder}/${sub.file}`;
                    subA.textContent = sub.label;
                    subA.style.textDecoration = "none";
                    subA.style.display = "block";
                    subA.style.marginBottom = "8px";
                    subA.style.color = "#555";

                    if (sub.file === currentFile) {
                        li.classList.add("active");
                        li.style.backgroundColor = "#2083b2";
                        a.style.color = "#fff";
                        a.style.fontWeight = "bold";
                        subA.style.color = "#fff";
                        subA.style.fontWeight = "bold";
                        submenuActive = true;
                    }

                    subLi.appendChild(subA);
                    subUl.appendChild(subLi);
                });

                if (submenuActive) {
                    subUl.style.display = "block";
                    toggleBtn.style.transform = "rotate(180deg)";
                }

                toggleBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const isVisible = subUl.style.display === "block";
                    subUl.style.display = isVisible ? "none" : "block";
                    toggleBtn.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
                });

                li.appendChild(subUl);
            }
        }

        ul.appendChild(li);
    });
}


renderDynamicMenu("commonMenuContainer");
