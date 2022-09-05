# CSV Paster

csv paster is a library that allows to paste excel/csv format data into a html table on multiple input's such as normal
input,checkbox,radio and select.

packages: https://www.npmjs.com/package/csv-paster
demo: https://birajmainali.github.io/csv-content-import/

## Preview
https://www.loom.com/share/c6952f01cac34e7cbaf0b6fcd751835d

## Basic Usage
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
3. add class `skip-paste` to skip the paste.
4. add class `watch` to get the updated rows from event, if we missed class `watch` this does not tack the changes occured by the lastest paste, for
   e.g. we have an input field named barcode. if the barcode changed we might fetch product from server according to barcode, in this case we need to tack the newly updated barcode to fetch the product, in this case we need to track the newly updated barcode to fetch the product
5. add class `watch` on `td` element we can ensure current row is watchable or not.

## Events

While pasting the data from csv/excel to web table, we might need some events, for that paster dispatch event `pasteComplete` on `tableElem` with current table objects, likely in some cases we might know the pasted row count before filling data into a table for that paster dispatch `onRows` event with the lenght of current rows.


## Usages

### excel sample

![img.png](img.png)

Event listening on paste complete

```js
document.addEventListener('DOMContentLoaded', () => {
    const tabeleElem = document.querySelector('#csv');
    tabeleElem.addEventListener('pasteComplete', (ev) => {
        console.log(ev.detail);
    });
})
```

event data

```json
[
   {
      "barcode": "90239209302",
      "product": "1",
      "unit": "Pcs",
      "quantity": "10",
      "rate": "150",
      "isDiscount": "true"
   }
]
```

