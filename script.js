const __ = document.querySelector.bind(document);
const __a = document.querySelectorAll.bind(document);

const pasteTarget = __a('.paste-target');
pasteTarget.forEach(target => {
    target.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain');
        const pasteDataArray = pasteData.split('\n');
        const body = __('tbody');
        pasteDataArray.forEach(row => {
            const cells = row.split('\t');
            const rowElement = document.createElement('tr');
            cells.forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cell;
                rowElement.appendChild(cellElement);
            })
            body.prepend(rowElement);
        });
    });
})