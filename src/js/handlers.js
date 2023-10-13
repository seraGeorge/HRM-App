import { loader, sortIcon, tableData, year } from "./elements.js";
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


export const makeSortIconVisible = (index) => {
    sortIcon.forEach((item, id) => {
        if (id != index) {
            sortIcon[id].style.visibility = "hidden"
        }
        else {
            sortIcon[index].style.visibility = "visible"
        }
    })

}

export const toggleBtn = (button, popUp) => {
    button.addEventListener("click", () => {
        popUp.classList.toggle("no-display")
    })

}
export const getFilterChips = (selector) => {
    const filterChips = document.querySelectorAll(selector);
    const filterValues = [];
    filterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".chip-heading");
        filterValues.push(filterChipValue.innerHTML);
    });
    return filterValues;
}


export const filterData = (result, designationFilters, departmentFilters, skillsFilters) => {
    let tableData;
    if (skillsFilters.length != 0 || departmentFilters.length != 0 || designationFilters.length != 0) {
        tableData = result.filter((e) => {
            const designationMatch = designationFilters.length != 0 ? designationFilters.includes(e.designation) : true;
            const departmentMatch = departmentFilters.length != 0 ? departmentFilters.includes(e.department) : true;
            const skillMatch = skillsFilters.length != 0 ? skillsFilters.every(filter => e.skills.some(skill => skill.name === filter)) : true;
            // Include the employee in the filtered array if any of the conditions are true
            return designationMatch && departmentMatch && skillMatch;
        });
    } else {
        tableData = result;
    }
    return tableData
}

export function filterEmployeesByProperty(employees, searchText, selectedProperty) {
    const filteredVal = [];

    for (const employee of employees) {
        let propertyValue;

        if (selectedProperty === "skills") {
            propertyValue = employee[selectedProperty].map((skill) => skill.name.toLowerCase());
            if (propertyValue.filter((skill) => skill.includes(searchText.toLowerCase())).length > 0) {
                filteredVal.push(employee);
            }
        }
        else if (selectedProperty === "name") {
            selectedProperty = "emp_name"
            propertyValue = employee[selectedProperty].toLowerCase();
            if (propertyValue.includes(searchText.toLowerCase())) {
                filteredVal.push(employee);
            }
        }
        else {
            propertyValue = employee[selectedProperty].toLowerCase();
            if (propertyValue.includes(searchText.toLowerCase())) {
                filteredVal.push(employee);
            }
        }
    }

    return filteredVal;
}

export function getSearchedData(employeeList, selectedProperty, searchText) {
    let tableData = [];
    if (searchText !== "") {
        if (selectedProperty === "all") {
            const searchValueList = document.querySelectorAll(".search-filter-label");
            const filteredSearchValueList = Array.from(searchValueList).filter(
                (searchValue) => searchValue.innerHTML.toLowerCase() !== "all"
            );
            for (const filterSearchValue of filteredSearchValueList) {
                const searchValResult = filterEmployeesByProperty(
                    employeeList,
                    searchText,
                    filterSearchValue.innerHTML.toLowerCase()
                );

                tableData.push(...searchValResult);
            }
        } else {
            const searchValResult = filterEmployeesByProperty(
                employeeList,
                searchText,
                selectedProperty
            );

            tableData = [...searchValResult];
        }
    } else {
        tableData = employeeList;
    }
    return tableData
}

export const hideDropdownIfNotTarget = (dropdown, button, event) => {
    if (!(button.contains(event.target)) && !(dropdown.contains(event.target))) {
        if (!dropdown.classList.contains("no-display")) {
            dropdown.classList.add("no-display");
        }
    }
}
export const setOptionsList=(data,selectEntry)=>{
    data.forEach((value)=>{
        const optionVal = document.createElement("option");
        optionVal.value=value;
        optionVal.innerHTML=value;
        selectEntry.appendChild(optionVal);
    })
}