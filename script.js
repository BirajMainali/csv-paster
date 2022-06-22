const __ = document.querySelector.bind(document);
const fragment = new DocumentFragment()
const ADDED_HEADERS = [];

const pasteTarget = __('.paste-target');
pasteTarget.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasteDataArray = getPasteDataArray(e);
    appendDataToTable(pasteDataArray);
});

const appendDataToTable = ({ headers, rows }) => {
    const body = __('tbody');
    const head = __('thead');
    const row = document.createElement("tr");
    headers.forEach(x => {
        if (ADDED_HEADERS.includes(x)) return;
        const tdElm = document.createElement('th');
        tdElm.textContent = x;
        tdElm.dataset.header = x;
        ADDED_HEADERS.push(x);
        row.appendChild(tdElm);
    });
    head.append(row);

    rows.forEach(row => {
        const cells = row.split('\t');
        const rowElement = document.createElement('tr');
        cells.forEach(cell => {
            const cellElement = document.createElement('td');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        })
        fragment.appendChild(rowElement);
    });
    body.appendChild(fragment);
}

const getPasteDataArray = (event) => {
    const pasteData = event.clipboardData.getData('text/plain');
    let arr = pasteData.split('\n');
    let headers = Array.from(arr[0].split('\t'));
    const rows = arr.filter(row => row.length > 0)
    rows.splice(0, 1); // removing header data.
    return { headers, rows };
}

__(".logger").addEventListener('click', () => {
    const data = getTableData();
    console.log(data);
})


const getTableData = () => {
    const table = __('table');
    const rows = table.querySelectorAll('tr');
    const tableHeaders = Array.from(table.querySelectorAll('th')).map(x => x.dataset.header);
    const tableData = Array.from(rows).map(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(x => x.textContent);
        return cells.reduce((acc, cur, index) => {
            acc[tableHeaders[index]] = cur;
            return acc;
        }, {})
    })
    return tableData;
}