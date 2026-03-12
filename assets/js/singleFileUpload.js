function checkFile(selector) {
    const fileInput = $(selector);

    if (fileInput.length === 0) {
        console.error("No file input found for selector:", selector);
        return null;
    }

    const files = fileInput[0].files;
    const validTypes = ['application/pdf', 'image/jpeg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const maxFiles = 5;

    const errorSpanId = selector.replace('#', '') + '_error_placeholder';
    const errorSpan = $('#' + errorSpanId);

    // Reset error
    errorSpan.text('');

    if (files.length === 0) {
        errorSpan.text("Please select at least one file.");
        return null;
    }

    if (files.length > maxFiles) {
        errorSpan.text(`You can upload a maximum of ${maxFiles} files.`);
        return null;
    }

    for (let file of files) {
        if (!validTypes.includes(file.type)) {
            errorSpan.text("Invalid file type. Allowed: PDF, JPG, JPEG.");
            return null;
        }

        if (file.size > maxSize) {
            errorSpan.text("Each file must be 2MB or less.");
            return null;
        }
    }

    return files;
}

async function processFile(selector) {
    const files = checkFile(selector);
    if (!files) return;

    const readAsBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve({
                    filename: file.name,
                    fileBase64: reader.result.split(',')[1], // Remove data:*/*;base64,
                    fileType: file.type,
                    fileSize: file.size,
                });
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });

    const resultList = await Promise.all(
        Array.from(files).map(file => readAsBase64(file))
    );

    renderFileList(resultList);
    return resultList;
}
function renderFileList(files) {
    const preview = $('#filePreviewList');
    preview.empty();

    files.forEach(file => {
        const item = $('<div>').text(`✔️ ${file.filename} (${(file.fileSize / 1024).toFixed(1)} KB)`);
        preview.append(item);
    });
}



window.checkFile = checkFile;
window.processFile = processFile;
window.renderFileList = renderFileList;