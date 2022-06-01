const __ = document.querySelector.bind(document);
const __a = document.querySelectorAll.bind(document);

const pasteTarget = __('.paste-target');
pasteTarget.addEventListener('paste', (e) => {
    e.preventDefault();
    removeTargetRow();
    const pasteDataArray = getPasteDataArray(e);
    appendDataToTable(pasteDataArray);
    appendTargetRowToEnd();
});

const appendDataToTable = (data) => {
    const body = __('tbody');
    data.forEach(row => {
        const cells = row.split('\t');
        const rowElement = document.createElement('tr');
        cells.forEach(cell => {
            const cellElement = document.createElement('td');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        })
        body.appendChild(rowElement);
    });
}

const removeTargetRow = () => {
    const targetRow = __('#target-row');
    targetRow.remove();
}

const appendTargetRowToEnd = () => {
    const targetRowTemplateElem = __("#target-row-template");
    const targetRow = targetRowTemplateElem.content.cloneNode(true);
    const body = __('tbody');
    body.appendChild(targetRow);
}

const getPasteDataArray = (event) => {
    const pasteData = event.clipboardData.getData('text/plain');
    let pasteDataArray = pasteData.split('\n');
    return pasteDataArray.filter(row => row.length > 0);
}


__(".logger").addEventListener('click', () => {
    const data = getTableData();
    console.log(data);
})

const getTableData = () => {
    const table = __('table');
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    const header = Array.from(headerCells).map(cell => cell.textContent);
    const body = table.querySelector('tbody');
    const rows = body.querySelectorAll('tr');
    const data = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.textContent);
        return Object.assign({}, ...header.map((key, index) => ({ [key]: rowData[index] })));
    });
    return data;
}