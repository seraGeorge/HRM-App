import { sortIcon } from "./elements.js";
import { setTableData } from "./setTable.js";

export function buttonClickHandler(event, employees, index) {
    let sortCriteriaList = ["id", "emp_name", "designation", "department"];
    let currentSortCriteria = sortCriteriaList[index]
    sortIcon.forEach((item, id) => {
        console.log(id,index)
        if (id != index) {
            sortIcon[id].style.visibility = "hidden"
        }
        else {
            sortIcon[index].style.visibility = "visible"
        }
    })
    employees.sort((a, b) => {
        let x = a[currentSortCriteria].toLowerCase();
        let y = b[currentSortCriteria].toLowerCase();
        if (event.target.classList.contains("rotate")) {
            sortIcon[index].classList.remove('rotate');
            if (x > y) {
                return 1;
            }
            if (y > x) {
                return -1;
            }
            return 0;            
        }
        else {
            sortIcon[index].classList.add('rotate');
            if (x > y) {
                return -1;
            }
            if (y > x) {
                return 1;
            }
            return 0;
            
        }
    })
    console.log(employees)
    setTableData(employees)
}
