import { applyAllBtn, departmentDropDownBtn, departmentOptionsList, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, skillsDropDownBtn, skillsOptionsList, skillsSelectedList, sortBtnList, sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { displayLoading, hideLoading, toggleBtn } from "./handlers.js";
import { sortCriteria } from "./helperFunctions.js";
import { resetFilter, setDropDown, setDropDownData } from "./setDropDownData.js";
import { setTableData } from "./setTable.js";
import { sortBtnHandler } from "./sortFn.js";


//Loader before the table Data
displayLoading();

let dataVal;

const result = readUserData(`/`);
result.then(data => {
    //Hiding loader
    hideLoading()

    sortBtnHandler(data.employees, 0, sortCriteria(0))
    setTableData(data.employees)
    setDropDownData(data)
    //Copy of the data from firebase
    dataVal = data;

}).catch((error) => console.error(error))

sortBtnList.forEach((sortBtn, index) =>
    sortBtn.addEventListener("click", () => {
        sortBtnHandler(dataVal.employees, index, sortCriteria(index))
    }))


toggleBtn(filterBtn, mainFilterDropDown)
toggleBtn(designationDropDownBtn, designationOptionsList)
toggleBtn(departmentDropDownBtn, departmentOptionsList)
toggleBtn(skillsDropDownBtn, skillsOptionsList)



applyAllBtn.addEventListener("click", () => {
    mainFilterDropDown.classList.remove("display")
    const designationFilterChips = document.querySelectorAll(".designation-filter ")
    const departmentFilterChips = document.querySelectorAll(".department-filter ")
    const skillsFilterChips = document.querySelectorAll(".skills-filter ")

    const designationFilters = [];
    const departmentFilters = [];
    const skillsFilters = [];

    designationFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        designationFilters.push(filterChipValue.innerHTML);
    })
    departmentFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        departmentFilters.push(filterChipValue.innerHTML);
    })
    skillsFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        skillsFilters.push(filterChipValue.innerHTML);
    })
    let tableData;
    if (skillsFilters.length != 0 || departmentFilters.length != 0 || designationFilters.length != 0) {
        const employees = dataVal.employees;
        tableData = employees.filter((e) => {
            const designationMatch = designationFilters.length != 0 ? designationFilters.includes(e.designation) : true;
            const departmentMatch = departmentFilters.length != 0 ? departmentFilters.includes(e.department) : true;
            const skillMatch = skillsFilters.length != 0 ? e.skills.some((f) => skillsFilters.includes(f.name)) : true;

            // Include the employee in the filtered array if any of the conditions are true
            console.log(designationMatch)
            return designationMatch && departmentMatch && skillMatch;
        });
    }
    else {
        tableData = dataVal.employees;
        sortBtnHandler(dataVal.employees, 0, sortCriteria(0))
    }
    setTableData(tableData)

})

