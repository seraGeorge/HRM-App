import { sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { buttonClickHandler, displayLoading, hideLoading } from "./handlers.js";
import { setTableData } from "./setTable.js";


//Loader before the table Data
displayLoading();

let dataVal;

const result = readUserData(`/`);
result.then(data => {
    //Hiding loader
    hideLoading()
    setTableData(data)
    //Copy of the data from firebase
    dataVal = data;
    sortIcon.forEach((item, index) => item.addEventListener("click", (event) => { buttonClickHandler(event, dataVal, index) }))
}).catch((error) => console.error(error))


