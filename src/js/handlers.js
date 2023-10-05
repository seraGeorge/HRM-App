import { loader,  tableData, year } from "./elements.js";
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

export function buttonClickHandler(event) {
    console.log('Button clicked!', event.target);
    event.target.classList.toggle('rotate');
}
