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

export const toggleBtn = (button, dropdown) => {
    button.addEventListener("click", () => {
        dropdown.classList.toggle("display")
    })

}
export const getFilterChips = (selector) => {
    const filterChips = document.querySelectorAll(selector);
    const filterValues = [];
    filterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
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
            const skillMatch = skillsFilters.length != 0 ? e.skills.some((f) => skillsFilters.includes(f.name)) : true;
            // Include the employee in the filtered array if any of the conditions are true
            return designationMatch && departmentMatch && skillMatch;
        });
    } else {
        tableData = result;
    }
    return tableData
}

function filterBySkills(employee, searchText) {
    const skillNames = employee.skills.map((skill) => skill.name.toLowerCase());
    return skillNames.some((skill) => skill.includes(searchText.toLowerCase()));
}

function filterByName(employee, searchText) {
    const empName = employee.emp_name.toLowerCase();
    return empName.includes(searchText.toLowerCase());
}

function filterByProperty(employee, selectedProperty, searchText) {
    const propertyValue = employee[selectedProperty].toLowerCase();
    return propertyValue.includes(searchText.toLowerCase());
}

export function filterEmployeesByProperty(employees, searchText, selectedProperty) {

    const filteredVal = employees.filter((employee) => {
        if (selectedProperty === "skills") {
            return filterBySkills(employee, searchText);
        } else if (selectedProperty === "name") {
            return filterByName(employee, searchText);
        } else {
            return filterByProperty(employee, selectedProperty, searchText);
        }
    });

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
        if (dropdown.classList.contains("display")) {
            dropdown.classList.remove("display");
        }
    }
}
