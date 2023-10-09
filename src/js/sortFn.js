import { sortIcon } from "./elements.js";
import { makeSortIconVisible } from "./handlers.js";
import { sortFn } from "./helperFunctions.js";
import { setTableData } from "./setTable.js";
export function sortBtnHandler(employees, index, currentSortCriteria) {
    makeSortIconVisible(index);

    sortIcon[index].classList.toggle('rotate');
    let flag = sortIcon[index].classList.contains("rotate") ? -1 : +1;

    employees.sort((a, b) => {

        let x = a[currentSortCriteria].toLowerCase();
        let y = b[currentSortCriteria].toLowerCase();
        return sortFn(x, y, flag)

    })

    return employees;
}
