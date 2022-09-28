let CURRENT_TRACE = null;

const classConstants = Object.freeze({
    watch: 'watch',
    skipPaste: 'skip-paste',
});

const eventsConstants = Object.freeze({
    onRows: 'onRows',
    pasteComplete: 'pasteComplete',
});

const getclipboardData = (ev) => {
    const values = ev.clipboardData.getData("text/plain").split("\n").map(row => row.split('\t'));
    values.splice(values.length - 1, 0);
    return values;
}

const getSerialized = (tableElem) => {
    const rows = Array.from(tableElem.querySelectorAll('tbody tr')).filter(row => row.dataset.trace === CURRENT_TRACE);
    if (!rows.length) return;
    const tableHeaders = Array.from(tableElem.querySelectorAll('th')).map(x => x.dataset.header).filter(x => x);
    return Array.from(rows).map(row => {
        const cells = Array.from(row.querySelectorAll('td')).filter(x => x.querySelector('input') || x.querySelector('select'));
        return cells.reduce((acc, cur, index) => {
            acc[tableHeaders[index]] = getCurrentValue(cur);
            return acc;
        }, {})
    })
}

const getCurrentValue = (currElem) => {
    const input = currElem.querySelector('input');
    if (input) return input.value;
    const selectElem = currElem.querySelector('select');
    if (selectElem) return selectElem.value;
}

const setCurrentValue = (currentElem, data) => {
    let inputElem = null;
    inputElem = currentElem.querySelector('input');
    if (inputElem) {
        if (inputElem.type === 'checkbox' || inputElem.type === 'radio') {
            [inputElem.checked, inputElem.value] = [!!data];
        } else {
            inputElem.value = data;
        }
    } else {
        inputElem = currentElem.querySelector('select');
        if (inputElem) inputElem.value = data;
    }
    inputElem.dispatchEvent(new Event('change', { bubbles: true }));
    inputElem.dispatchEvent(new Event('input', { bubbles: true }));
    if (!inputElem.closest('td').classList.contains(classConstants.watch)) return;
    inputElem.closest('tr').dataset.trace = CURRENT_TRACE;
}

const dispatchEvent = (elem, eventName, data) => {
    if (!data) return;
    const event = new CustomEvent(eventName, {
        bubbles: true,
        detail: data,
    });
    elem.dispatchEvent(event);
};

document.addEventListener('paste', async (ev) => {
    const tableElem = ev.target.closest('#csv');
    if (!tableElem) return;
    ev.preventDefault();
    const data = getclipboardData(ev);
    await dispatchonRows(tableElem, data.length);
    fillInputs(ev, data);
    dispatchEvent(tableElem, eventsConstants.pasteComplete, getSerialized(tableElem));

});

async function dispatchonRows(tableElem, rowsCount) {
    await new Promise((resolve) => {
        dispatchEvent(tableElem, eventsConstants.onRows, rowsCount);
        resolve();
    });
}

function fillInputs(ev, clipboardData) {
    CURRENT_TRACE = Math.random().toString(36).substring(7);
    let rows = document.querySelectorAll('#csv tbody tr');
    const currentRow = ev.target.closest('tbody tr');
    const currentRowIndex = Array.from(rows).indexOf(currentRow);
    const currentCell = ev.target.closest('td');
    const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);
    rows = Array.from(rows).filter((row, index) => index >= currentRowIndex);
    for (let rowIdx = 0; rowIdx < clipboardData.length; rowIdx++) {
        let cells = Array.from(rows[rowIdx].cells).filter((cell, cellIdx) => cellIdx >= currentCellIndex);
        cells = Array.from(cells).filter(cell => !cell.classList.contains(classConstants.skipPaste));
        for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
            const value = clipboardData[rowIdx][cellIdx];
            if (!value) continue;
            setCurrentValue(cells[cellIdx], value);
        }
    }
}