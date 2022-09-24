const __ = document.querySelector.bind(document);
const tableElem = __('#csv');


document.addEventListener("DOMContentLoaded", cloneRow);

tableElem.addEventListener("onRows", async (ev) => {
    for (let i = 0; i < ev.detail; i++) {
        cloneRow();
    }
});

tableElem.addEventListener("pasteComplete", (ev) => {
    console.log(ev.detail);
});

function cloneRow() {
    const rowTemplate = __("#rowTemplate");
    const tbody = __("tbody");
    const row = rowTemplate.content.cloneNode(true);
    tbody.appendChild(row);
};