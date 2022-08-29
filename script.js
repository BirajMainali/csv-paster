document.addEventListener('paste', (ev) => {
    ev.preventDefault();
    if (!ev.target.closest("table")) return;
    let rows = document.querySelectorAll('table tbody tr');
    const currentRow = ev.target.closest('tr');
    const currentRowIndex = Array.from(rows).indexOf(currentRow);
    const currentCell = ev.target.closest('td');
    const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);
    rows = Array.from(rows).filter((row, index) => index >= currentRowIndex);
    const values = ev.clipboardData.getData("text/plain").split("\n").map(row => row.split('\t'));
    for (let rowIdx = 0; rowIdx < values.length; rowIdx++) {
        if (rowIdx >= rows.length) {
            const newRow = currentRow.cloneNode(true);
            currentRow.parentNode.appendChild(newRow);
            rows.push(newRow);
        }
        let cells = Array.from(rows[rowIdx].cells).filter((cell, cellIdx) => cellIdx >= currentCellIndex);
        cells = Array.from(cells).filter(cell => !cell.classList.contains('skip-import'));
        for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
            const input = cells[cellIdx].querySelector('input');
            const value = values[rowIdx][cellIdx];
            if(!value) continue;
            if (!input) continue;
            input.value = value;
        }
    }
});