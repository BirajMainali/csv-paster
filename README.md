# CSV Paster

csv paster is a library that allows to paste excel/csv format data into a html table on multiple input's such as normal
input,checkbox,radio and select.

Packages: https://www.npmjs.com/package/csv-paster

Demo: https://birajmainali.github.io/csv-paster/

## Preview
https://www.loom.com/share/c6952f01cac34e7cbaf0b6fcd751835d

## Installation

> npm
   ```npm
   npm i csv-paster
   ```
> Yarn
   ```yarn
   yarn add csv-paster
   ```

- inject `import "csv-paster/csv-paster";`

1. table must have id `csv`
2. add data-header attribute on table header with corresponded object key, to get after pasting the data, paster dispatch the
   event `pasteComplete` with lastest change table data object array, for that we need to add data-header.

#### Example for header  configuration
````html
<thead class="bg-warning">
      <tr>
      <th data-header="barcode">Barcode</th>
      <th data-header="product">Product</th>
      <th data-header="unit">Unit</th>
      <th data-header="quantity">Quantity</th>
      <th data-header="rate">Rate</th>
      <th data-header="Discount">Discount</th>
      </tr>
   </thead>
````

#### Estimated Result.
```json
[
   {
      "barcode": "90239209302",
      "product": "1",
      "unit": "Pcs",
      "quantity": "10",
      "rate": "150",
      "Discount": "30"
   }
]
```

3. add class `skip-paste` to skip the paste.
4. add class `watch` to get the updated rows from event, if we missed class `watch` this does not tack the changes occured by the lastest paste, for
   e.g. we have an input field named barcode. if the barcode changed we might fetch product from server according to barcode, in this case we need to tack the newly updated barcode to fetch the product, in this case we need to track the newly updated barcode to fetch the product
5. add class `watch` on `td` element we can ensure current row is watchable or not.


## Custom Helping Events
1. `OnRows`, This event fired when the users paste the csv content into a table. In some cases initially table may not have a avliable rows to paste. so we need handle rows by catching this event manually.

2. `pasteComplete`, This event after pasting the data. this gives the lastest changed paste content. to track the latest change we need to add class `watch` otherwise paster just paste the without providing the changes.



## Usages

```js
const __ = document.querySelector.bind(document);
const tableElem = __('#csv');


document.addEventListener("DOMContentLoaded", cloneRow);

// this event gives the row count of pasting item, so that we can manage the unavailable rows like below.
tableElem.addEventListener("onRows", async (ev) => {
    for (let i = 0; i < ev.detail; i++) {
        cloneRow();
    }
});

// This event gives the latest change items, which is indicated by the watch
tableElem.addEventListener("pasteComplete", (ev) => {
    console.log(ev.detail);
});

function cloneRow() {
    const rowTemplate = __("#rowTemplate");
    const tbody = __("tbody");
    const row = rowTemplate.content.cloneNode(true);
    tbody.appendChild(row);
};
