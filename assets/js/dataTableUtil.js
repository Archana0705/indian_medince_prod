window.loadDataToTable = function ({
    tableId,
    apiUrl,
    httpMethod = 'POST',
    payload,
    rowBuilder,
    onTableInit = () => { } // callback to return DataTable instance
}) {
    const tableSelector = `#${tableId}`;
    const tableBody = $(`${tableSelector} tbody`);
    const colCount = $(`${tableSelector} thead th`).length || 10;
    tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-loading">Loading...</td></tr>');

    $.ajax({
        url: apiUrl,
        method: httpMethod.toUpperCase(),
        headers: {
            'X-APP-Key': "edm",
            'X-APP-Name': "edm"
        },
        data: { data: payload },
        dataType: 'json',
        cache: false,
        success(response) {
            tableBody.empty();

            // Handle { success: 0, message: "Data not found", pagination: { total: 0 } } when API omits data
            if (response && (response.success === 0 || response.success === false)) {
                const msg = (response.message || 'No Data Found').toString();
                tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">' + msg + '</td></tr>');
                return;
            }
            if (!response || response.data == null || response.data === '') {
                tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">No Data Found</td></tr>');
                return;
            }

            let raw;
            try {
                raw = decryptData(response.data);
            } catch (e) {
                console.error('Decrypt error:', e);
                tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">No Data Found</td></tr>');
                return;
            }

            // Handle decrypted payload that is { success: 0, message: "Data not found", pagination: { total: 0 } }
            let data = raw;
            if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
                if (raw.success === 0 || raw.success === false || (raw.pagination && Number(raw.pagination.total) === 0)) {
                    const msg = (raw.message || 'No Data Found').toString();
                    tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">' + msg + '</td></tr>');
                    return;
                }
                data = raw.data || raw.result || [];
            }

            if (!data || !Array.isArray(data) || data.length === 0) {
                tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">No Data Found</td></tr>');
                return;
            }

            if ($.fn.DataTable?.isDataTable(tableSelector)) {
                $(tableSelector).DataTable().clear().destroy();
            }

            const rows = data.map(rowBuilder).join('');
            tableBody.html(rows);

            const dtRef = $(tableSelector).DataTable({
                paging: true,
                searching: true,
                ordering: true,
                responsive: true,
            });

            // Send reference back to main script
            onTableInit(dtRef);
        },
        error(xhr, status, error) {
            console.error("API Error:", error);
            tableBody.html('<tr><td colspan="' + colCount + '" class="text-center dt-empty-state">No Data Found</td></tr>');
        }
    });
};
