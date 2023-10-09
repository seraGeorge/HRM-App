import { applyAllBtn, departmentDropDownBtn, departmentOptionsList, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, skillsDropDownBtn, skillsOptionsList, skillsSelectedList, sortBtnList, sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { applyFilter, displayLoading, filterData, hideLoading, toggleBtn } from "./handlers.js";
import { sortCriteria } from "./helperFunctions.js";
import { resetFilter, setDropDown, setDropDownData } from "./setDropDownData.js";
import { setTableData } from "./setTable.js";
import { sortBtnHandler } from "./sortFn.js";


//Loader before the table Data
displayLoading();

let dataVal;
let sortedData;

const result = readUserData(`/`);

async function fetchData() {
    let sortedData;

    try {
        const data = await readUserData(`/`);
        // Hiding loader
        hideLoading();
        sortedData = sortBtnHandler(data.employees, 0, sortCriteria(0));
        console.log(sortedData)
        // Copy of the data from firebase
        dataVal = data;
    } catch (error) {
        console.error(error);
        return null;
    }

    return sortedData;
}

fetchData()
    .then((result) => {
        if (result !== null) {
            setTableData(result)
            setDropDownData(dataVal)

            sortBtnList.forEach((sortBtn, index) =>
                sortBtn.addEventListener("click", () => {
                    sortedData = sortBtnHandler(dataVal.employees, index, sortCriteria(index));
                    setTableData(sortedData)
                }))


            toggleBtn(filterBtn, mainFilterDropDown)
            toggleBtn(designationDropDownBtn, designationOptionsList)
            toggleBtn(departmentDropDownBtn, departmentOptionsList)
            toggleBtn(skillsDropDownBtn, skillsOptionsList)





            applyAllBtn.addEventListener("click", () => {
                mainFilterDropDown.classList.remove("display");
                let tableData =applyFilter(result);
                setTableData(tableData);

            });



        } else {
            console.error("Error occurred.");
        }
    });

