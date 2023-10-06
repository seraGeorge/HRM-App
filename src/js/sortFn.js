import { sortIcon } from "./elements.js";
import { makeSortIconVisible } from "./handlers.js";
import { sortFn } from "./helperFunctions.js";
import { setTableData } from "./setTable.js";

export function sortBtnHandler(event, employees, index, currentSortCriteria) {
    makeSortIconVisible(index);
    let flag = 1;
    employees.sort((a, b) => {
        let x = a[currentSortCriteria].toLowerCase();
        let y = b[currentSortCriteria].toLowerCase();
        if (sortIcon[index].classList.contains("rotate")) {
            sortIcon[index].classList.remove('rotate');

            return sortFn(x, y, flag)
        }
        else {
            sortIcon[index].classList.add('rotate');
            flag = -1;
            return sortFn(x, y, flag)
        }
    })
    setTableData(employees)
}
