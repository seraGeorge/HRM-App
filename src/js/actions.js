import { sortIcon } from "./elements.js";
import { makeSortIconVisible } from "./handlers.js";
import { sortCriteria, sortFn } from "./helperFunctions.js";

//SORTING
export function sortBtnHandler(employees, index) {
    makeSortIconVisible(index);
    let currentSortCriteria = sortCriteria(index)

    let flag = sortIcon[index].classList.contains("rotate") ? -1 : +1;
    if (employees === undefined) return employees
    employees.sort((a, b) => {

        let x = a[currentSortCriteria].toLowerCase();
        let y = b[currentSortCriteria].toLowerCase();
        return sortFn(x, y, flag)

    })

    return employees;
}
//FILTERING
//get filter chips on the filter click from dropdown
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
//SEARCHING
function filterBySkills(employee, searchText) {
    const skillNames = employee.skills.map((skill) => skill.name.toLowerCase());
    return skillNames.some((skill) => skill.includes(searchText.toLowerCase()));
}
function filterByProperty(employee, selectedProperty, searchText) {
    const propertyValue = employee[selectedProperty].toLowerCase();
    return propertyValue.includes(searchText.toLowerCase());
}
export function filterEmployeesByProperty(employees, searchText, selectedProperty) {

    const filteredVal = employees.filter((employee) => {
        if (selectedProperty === "skills") {
            return filterBySkills(employee, searchText);
        } else {
            let ppty = selectedProperty === "name" ? "emp_name" : selectedProperty
            return filterByProperty(employee, ppty, searchText);
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