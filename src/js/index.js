import { state } from "./context.js";
import { addEmployeeBtn, applyAllBtn, departmentDropDownBtn, departmentOptionsList, designationDropDownBtn, designationOptionsList, filterBtn, mainFilterDropDown, searchDropDown, searchDropDownBtn, searchDropDownBtnText, searchFilterList, searchText, skillsDropDownBtn, skillsOptionsList, sortBtnList, sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { displayLoading, getFilterChips, hideDropdownIfNotTarget, hideLoading, toggleBtn } from "./handlers.js";
import { setFilterDropdownData } from "./setFilterDropdownData.js";
import { setTableData } from "./setTable.js";


//Loader before the table Data
displayLoading();

let dataCopy;
const result = readUserData(`/`);

result.then(data => {
    hideLoading()
    dataCopy = data;
    console.log(dataCopy)
    let employeeList = dataCopy.employees;


    if( (employeeList !== null)||(employeeList!==undefined) ){


        state.sort = 0
        localStorage.setItem('data', JSON.stringify(dataCopy));
        setTableData(employeeList)
        setFilterDropdownData(dataCopy)

        //sort btn on click
        sortBtnList.forEach((sortBtn, index) =>
            sortBtn.addEventListener("click", () => {

                // sets rotate by default to all icons except the current one
                sortIcon.forEach((icon, i) => {
                    if (i !== index) {
                        icon.classList.add('rotate');
                    }
                });
                //current icon toggles   
                sortIcon[index].classList.toggle('rotate');
                state.sort = index
                setTableData(employeeList)
            }))


        //toggles dropdown
        toggleBtn(filterBtn, mainFilterDropDown)
        toggleBtn(designationDropDownBtn, designationOptionsList)
        toggleBtn(departmentDropDownBtn, departmentOptionsList)
        toggleBtn(skillsDropDownBtn, skillsOptionsList)
        toggleBtn(searchDropDownBtn, searchDropDown)




        //filtering based on 3 filters
        applyAllBtn.addEventListener("click", () => {
            mainFilterDropDown.classList.add("no-display");
            const designationFilters = getFilterChips(".designation-filter ");
            const departmentFilters = getFilterChips(".department-filter ");
            const skillsFilters = getFilterChips(".skills-filter ");

            state.filter.designationFilters = designationFilters;
            state.filter.departmentFilters = departmentFilters;
            state.filter.skillsFilters = skillsFilters;

            setTableData(employeeList);
        });

        // set search dropdown button text equal to the text selected in the search dropdowwn 
        searchFilterList.forEach((searchFilter) => {
            const labelElement = document.querySelector(`label[for="${searchFilter.id}"]`);
            // label element for the search filter

            if (searchFilter.checked) {
                searchDropDownBtnText.innerHTML = labelElement.textContent
            }
            searchFilter.addEventListener("click", () => {
                searchDropDown.classList.add("no-display")
                searchDropDownBtnText.innerHTML = labelElement.textContent
            })
        })

        //search text on change
        searchText.addEventListener("input", () => {
            state.search.searchTerm = searchText.value.toLowerCase();
            state.search.property = searchDropDownBtnText.innerHTML.toLowerCase();
            setTableData(employeeList);
        })

        addEmployeeBtn.addEventListener("click", () => {
            window.location.href='./employeeDetails.html';
            localStorage.setItem('source', "add");   
            localStorage.setItem('data', JSON.stringify(dataCopy));         
        })

        document.addEventListener("click", (event) => {
            hideDropdownIfNotTarget(mainFilterDropDown, filterBtn, event);
            hideDropdownIfNotTarget(designationOptionsList, designationDropDownBtn, event);
            hideDropdownIfNotTarget(departmentOptionsList, departmentDropDownBtn, event);
            hideDropdownIfNotTarget(skillsOptionsList, skillsDropDownBtn, event);
            hideDropdownIfNotTarget(searchDropDown, searchDropDownBtn, event);
        })


    } else {
        console.error("Error occurred.");
    }
}).catch((error) => {
    console.error(error);
    return null;
});


