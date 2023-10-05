import { sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { buttonClickHandler, displayLoading, hideLoading } from "./handlers.js";
import { setTableData } from "./setTable.js";


//Loader before the table Data
displayLoading();
const result = readUserData(`/`);
result.then(data => {
    hideLoading()
    setTableData(data)
})


sortIcon.forEach((item) => item.addEventListener("click", buttonClickHandler))
