import { loader, tableData, year } from "./elements.js";
import { getYear } from "./helperFunctions.js";

year.innerHTML = getYear()
export const displayLoading = () => {
    loader.classList.add("display");
    tableData.style.display = "none"
}

export const hideLoading = () => {
    loader.classList.remove("display");
    tableData.style.display = "table"

}

export function buttonClickHandler(event, data, index) {
    event.target.classList.toggle('rotate');
    let rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while (switching) {
        switching = false;
        rows = tableData.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[index];
            y = rows[i + 1].getElementsByTagName("td")[index];
            if (event.target.classList.contains("rotate")) {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }
            }
            else{
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                    shouldSwitch = true;
                    break;
                }

            }
        }
        if (shouldSwitch) {

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
