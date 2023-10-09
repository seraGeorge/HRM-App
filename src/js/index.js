import { state } from "./context.js";
import { applyAllBtn, departmentDropDownBtn, departmentOptionsList, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, searchDropDown, searchDropDownBtn, searchDropDownBtnText, searchFilterList, searchText, skillsDropDownBtn, skillsOptionsList, skillsSelectedList, sortBtnList, sortIcon, tableData } from "./elements.js";
import { readUserData } from "./firebase.js";
import { displayLoading, filterData, getFilterChips, getTableData, hideLoading, toggleBtn } from "./handlers.js";
import { sortCriteria } from "./helperFunctions.js";
import { resetFilter, setDropDown, setDropDownData } from "./setDropDownData.js";
import { setTableData } from "./setTable.js";
import { sortBtnHandler } from "./sortFn.js";


//Loader before the table Data
displayLoading();

let dataVal;
const result = readUserData(`/`);
result.then(data => {
    hideLoading()
    dataVal = data;
    let employeeList = data.employees;
    if (employeeList !== null) {
        state.sort = 0
        setTableData(employeeList)
        setDropDownData(dataVal)

        sortBtnList.forEach((sortBtn, index) =>
            sortBtn.addEventListener("click", () => {
                sortIcon[index].classList.toggle('rotate');
                state.sort = index
                setTableData(employeeList)
            }))


        toggleBtn(filterBtn, mainFilterDropDown)
        toggleBtn(designationDropDownBtn, designationOptionsList)
        toggleBtn(departmentDropDownBtn, departmentOptionsList)
        toggleBtn(skillsDropDownBtn, skillsOptionsList)
        toggleBtn(searchDropDownBtn, searchDropDown)




        applyAllBtn.addEventListener("click", () => {
            mainFilterDropDown.classList.remove("display");
            const designationFilters = getFilterChips(".designation-filter ");
            const departmentFilters = getFilterChips(".department-filter ");
            const skillsFilters = getFilterChips(".skills-filter ");
        
            state.filter.designationFilters = designationFilters;
            state.filter.departmentFilters = departmentFilters;
            state.filter.skillsFilters = skillsFilters;
            setTableData(employeeList);
        });

        searchFilterList.forEach((searchFilter) => {
            const labelElement = document.querySelector(`label[for="${searchFilter.id}"]`);

            if (searchFilter.checked) {
                searchDropDownBtnText.innerHTML = labelElement.textContent
            }
            searchFilter.addEventListener("click", () => {
                searchDropDown.classList.remove("display")
                searchDropDownBtnText.innerHTML = labelElement.textContent
            })
        })


        searchText.addEventListener("input", () => {
            state.search.searchTerm = searchText.value.toLowerCase();
            state.search.property = searchDropDownBtnText.innerHTML.toLowerCase();
            setTableData(employeeList);
        })
        document.addEventListener("click", (event) => {
            event.stopPropagation()
            if (!(searchDropDownBtn === event.target) && (!(searchDropDownBtn.contains(event.target))) && !(searchDropDown.contains(event.target))) {
                if (searchDropDown.classList.contains("display")) {
                    searchDropDown.classList.remove("display")
                }
            }
        });

    } else {
        console.error("Error occurred.");
    }
}).catch((error) => {
    console.error(error);
    return null;
});


