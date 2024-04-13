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
    let values = ev.clipboardData.getData("text/plain");

    if(!values.includes("\t") && !values.includes("\n")) {
        return [];
    }

    values = values.split("\n").map(row => row.split('\t'));
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
        }, {
            idx: row.rowIndex - 1
        })
    })
}

const getCurrentValue = (currElem) => {
    const input = currElem.querySelector('input');
    if (input) {
        if(input.type === 'checkbox') return input.checked;
        else return input.value;
    }
    const selectElem = currElem.querySelector('select');
    if (selectElem) return selectElem.value;
}

function GetTruthyValue(value) {
    if(typeof value === 'boolean') return value;
    else if(typeof value === 'number') return !(value === 0);
    else if(typeof value === 'undefined') return false;
    else if (typeof value === 'string') {
        value = value.trim();
        if(value.toLowerCase() === 'true') return true;
        else if(value.toLowerCase() === 'false') return false;
        else if(value === '0') return false;
        else return true;
    }
}

const setCurrentValue = (currentElem, data) => {
    let inputElem = null;
    inputElem = currentElem.querySelector('input');
    if (inputElem) {
        if (inputElem.type === 'checkbox' || inputElem.type === 'radio') {
            inputElem.checked = GetTruthyValue(data);
        } else {
            inputElem.value = data;
        }
    } else {
        inputElem = currentElem.querySelector('select');
        if (inputElem) inputElem.value = data;
    }

    if (!inputElem.closest('td').classList.contains(classConstants.watch)) {
        inputElem.dispatchEvent(new Event('change', { bubbles: true }));
        inputElem.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }
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
    const data = getclipboardData(ev);
    if(data.length === 0) return;
    ev.preventDefault();
    await fillInputs(ev, data, tableElem);
    dispatchEvent(tableElem, eventsConstants.pasteComplete, getSerialized(tableElem));

});

async function dispatchonRows(tableElem, rowsCount) {
    await new Promise((resolve) => {
        dispatchEvent(tableElem, eventsConstants.onRows, rowsCount);
        resolve();
    });
}

async function fillInputs(ev, clipboardData, tableElem) {
    CURRENT_TRACE = Math.random().toString(36).substring(7);
    let rows = document.querySelectorAll('#csv tbody tr');
    const currentRow = ev.target.closest('tbody tr');
    const currentRowIndex = Array.from(rows).indexOf(currentRow);
    const currentCell = ev.target.closest('td');
    const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);

    if(clipboardData.length + currentRowIndex > tableElem.rows.length - 1) {
        await dispatchonRows(tableElem, clipboardData.length + currentRowIndex + 1 - tableElem.rows.length);
    }

    rows = document.querySelectorAll('#csv tbody tr');

    rows = Array.from(rows).filter((row, index) => index >= currentRowIndex);

    for (let rowIdx = 0; rowIdx < clipboardData.length; rowIdx++) {
        let cells = Array.from(rows[rowIdx].cells).filter((cell, cellIdx) => cellIdx >= currentCellIndex);
        cells = Array.from(cells).filter(cell => !cell.classList.contains(classConstants.skipPaste));
        for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
            const value = clipboardData[rowIdx][cellIdx];
            if(typeof value === "undefined") continue;
            setCurrentValue(cells[cellIdx], value);
        }
    }
}