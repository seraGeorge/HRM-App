import { sortBtnList, sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { displayLoading, hideLoading } from "./handlers.js";
import { setTableData } from "./setTable.js";
import { buttonClickHandler } from "./sortFn.js";


//Loader before the table Data
displayLoading();

let dataVal;

const result = readUserData(`/`);
result.then(data => {
    //Hiding loader
    hideLoading()
    sortIcon[0].style.visibility = "visible"
    setTableData(data.employees)
    //Copy of the data from firebase
    dataVal = data;
    sortBtnList.forEach((sortBtn, index) => sortBtn.addEventListener("click", (event) => { buttonClickHandler(event, dataVal.employees, index) }))
}).catch((error) => console.error(error))


