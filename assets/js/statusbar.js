// statusbar.js
export function renderStatusBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const statusItems = [
        { label: "Service Request", href: "allrequest.html" },
        { label: "My Queue", href: "/my-queue" },
        { label: "Reference Documents", href: "/reference-documents" },
        { label: "EDM Diary", href: "edm-diary.html" },
        { label: "Training", href: "/training" },
        { label: "Reports & Dashboards", href: "/reports-dashboards" },
        { label: "Contacts", href: "/contacts" },
    ];

    const colors = [
        "#FFE2E5",
        "#D6CCC8",
        "#DCFCE7",
        "#FFF4DE",
        "#F4E8FF",
        "#FFCDD3",
        "#BBDEFA"
    ];

    let html = '<div class="status-bar">';
    statusItems.forEach((item, index) => {
        html += `
            <a href="${item.href}" class="status-btns" 
                data-aos="fade-up" 
                data-aos-duration="600" 
                data-aos-delay="${100 * (index + 1)}"
                style="text-decoration:none;     background-color: ${colors[index % colors.length]};">
                <span class="fa fa-file-edit" aria-hidden="true" ></span>
                <h4>${item.label}</h4>
            </a>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

renderStatusBar("status-bar-container");
