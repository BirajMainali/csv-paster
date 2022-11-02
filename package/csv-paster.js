let CURRENT_TRACE = null;

const classConstants = Object.freeze({
  watch: "watch",
  skipPaste: "skip-paste",
});

const eventsConstants = Object.freeze({
  onRows: "onRows",
  pasteComplete: "pasteComplete",
});

const getclipboardData = (ev) => {
  let values = ev.clipboardData.getData("text/plain");

  if (!values.includes("\t") && !values.includes("\n")) {
    return [];
  }

  values = values.split("\n").map((row) => row.split("\t"));
  values.splice(values.length - 1, 0);
  return values;
};

const getSerialized = (tableElem) => {
  const rows = Array.from(tableElem.querySelectorAll("tbody tr")).filter(
    (row) => row.dataset.trace === CURRENT_TRACE
  );
  if (!rows.length) return;
  const tableHeaders = Array.from(tableElem.querySelectorAll("th"))
    .map((x) => x.dataset.header)
    .filter((x) => x);
  return Array.from(rows).map((row) => {
    const cells = Array.from(row.querySelectorAll("td")).filter(
      (x) => x.querySelector("input") || x.querySelector("select")
    );
    return cells.reduce(
      (acc, cur, index) => {
        acc[tableHeaders[index]] = getCurrentValue(cur);
        return acc;
      },
      {
        idx: row.rowIndex - 1,
      }
    );
  });
};

const getCurrentValue = (currElem) => {
  const input = currElem.querySelector("input");
  if (input) return input.value;
  const selectElem = currElem.querySelector("select");
  if (selectElem) return selectElem.value;
};

const setCurrentValue = (currentElem, data) => {
  let inputElem = null;
  inputElem = currentElem.querySelector("input");
  if (inputElem) {
    if (inputElem.type === "checkbox" || inputElem.type === "radio") {
      [inputElem.checked, inputElem.value] = [!!data];
    } else {
      inputElem.value = data;
    }
  } else {
    inputElem = currentElem.querySelector("select");
    if (inputElem) inputElem.value = data;
  }

  if (!inputElem.closest("td").classList.contains(classConstants.watch)) {
    inputElem.dispatchEvent(new Event("change", { bubbles: true }));
    inputElem.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
  inputElem.closest("tr").dataset.trace = CURRENT_TRACE;
};

async function dispatch(elem, eventName, data) {
  if (!data) return;
  await new Promise((resolve) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      detail: data,
    });
    elem.dispatchEvent(event);
    resolve();
  });
}

document.addEventListener("paste", async (ev) => {
  const tableElem = ev.target.closest("#csv");
  if (!tableElem) return;
  const data = getclipboardData(ev);
  if (data.length === 0) return;
  ev.preventDefault();
  await fillInputs(ev, data, tableElem);
  dispatchEvent(
    tableElem,
    eventsConstants.pasteComplete,
    getSerialized(tableElem)
  );
});

const adjustRowsBeforePaste = async (tableElem, row, data) => {
  if (data.length + row.rowIndex > tableElem.rows.length - 1) {
    await dispatch(tableElem, eventsConstants.onRows, data.length);
  }
};

const pasteData = (event, data, elem) => {
  const currentRow = event.target.closest("tbody tr");
  const currentCell = event.target.closest("td");

  adjustRowsBeforePaste(elem, currentRow, data);

  const rows = Array.from(document.querySelectorAll("#csv tbody tr")).filter(
    (row, index) => index >= currentRow.rowIndex
  );

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const cells = Array.from(rows[rowIdx].cells).filter(
      (cell, cellIdx) => cellIdx >= currentCell.cellIndex
    );

    for (let cellIdx = 0; cellIdx < data.length; cellIdx++) {
      const value = data[rowIdx][cellIdx];
      if (!value) continue;
      setCurrentValue(cells[cellIdx], value);
    }
  }
};

const setInput = (cellElem, value) => {};
