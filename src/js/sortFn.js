import { sortIcon } from "./elements.js";
import { makeSortIconVisible } from "./handlers.js";
import { sortCriteria, sortFn } from "./helperFunctions.js";
import { setTableData } from "./setTable.js";

export function sortBtnHandler(employees, index) {
    makeSortIconVisible(index);
    let currentSortCriteria = sortCriteria(index)

    let flag = sortIcon[index].classList.contains("rotate") ? -1 : +1;
    if (employees === undefined) return employees
    employees.sort((a, b) => {

        let x = a[currentSortCriteria].toLowerCase();
        let y = b[currentSortCriteria].toLowerCase();
        return sortFn(x, y, flag)

    })

    return employees;
}
