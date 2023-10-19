import { loader, skillsFormEntrySelectedList, skillsList, sortIcon, tableData, year } from "./elements.js";
import { getDate, getYear, isValidDateFormat, sortCriteria, sortFn } from "./helperFunctions.js";

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
        if (!dropdown.classList.contains("no-display")) {
            dropdown.classList.add("no-display");
        }
    }
}
export const setOptionsList = (data, selectEntry) => {
    data.forEach((value) => {
        const optionVal = document.createElement("option");
        optionVal.value = value;
        optionVal.innerHTML = value;
        selectEntry.appendChild(optionVal);
    })
}
export const setFormValue = (inputId, value) => {
    const element = document.getElementById(inputId);
    if (element) {
        element.value = value;
    }
}
// Function to check if any form field has changed
export const hasFormChanged = (formDataObj, empToEdit, dataObj) => {
    let genderFlag = true
    if (["Male", "Female"].includes(empToEdit.gender)) {
        genderFlag = formDataObj.gender !== empToEdit.gender;
    }
    else {
        genderFlag = (formDataObj.gender_other_val !== empToEdit.gender);
    }
    return (
        formDataObj.name !== empToEdit.emp_name ||
        formDataObj.email !== empToEdit.email ||
        formDataObj.phone !== empToEdit.phone ||
        formDataObj.address !== empToEdit.address ||
        formDataObj.date_of_birth !== formatDate(empToEdit.date_of_birth) ||
        formDataObj.date_of_joining !== formatDate(empToEdit.date_of_joining) ||
        formDataObj.designation !== empToEdit.designation ||
        formDataObj.department !== empToEdit.department ||
        formDataObj.employment_mode !== empToEdit.employment_mode ||
        genderFlag || !arraysEqual(getSelectedSkills(dataObj), empToEdit.skills)
    );
}
// Function to format the date
export const formatDate = (dateString) => {
    return isValidDateFormat(dateString) ? getDate(dateString) : dateString;
}
// Function to get selected skills from the DOM
export const getSelectedSkills = (dataObj) => {
    const skillsTagList = document.querySelectorAll(".chip");
    const skillValues = Array.from(skillsTagList).map((skillTag) => skillTag.querySelector(".chip-heading").innerHTML);
    return dataObj.skills.filter(skill => skillValues.includes(skill.name));
}
export const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const idSet1 = new Set(arr1.map(obj => obj.id));
    const idSet2 = new Set(arr2.map(obj => obj.id));

    return [...idSet1].every(id => idSet2.has(id));
}
export const updateButtonStyle = (submitBtn, hasChanged) => {
    submitBtn.style.opacity = hasChanged ? "1" : "0.3";
    submitBtn.disabled = !hasChanged;
}
export const getNewEmployeeDetails = (formDataObj, dataObj) => {
    let newDataObj = {}
    newDataObj.emp_name = formDataObj.name;
    newDataObj.email = formDataObj.email;
    newDataObj.phone = formDataObj.phone;
    newDataObj.address = formDataObj.address;
    newDataObj.date_of_birth = formDataObj.date_of_birth;
    newDataObj.date_of_joining = formDataObj.date_of_joining;
    newDataObj.designation = formDataObj.designation;
    newDataObj.department = formDataObj.department;
    newDataObj.employment_mode = formDataObj.employment_mode;
    newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender_other_val : formDataObj.gender;
    const skillsTagList = document.querySelectorAll(".chip");
    const skillValues = Array.from(skillsTagList).map((skillTag) => skillTag.querySelector(".chip-heading").innerHTML);
    const skillArrayObj = dataObj.skills.filter(skill => skillValues.includes(skill.name))
    newDataObj.skills = skillArrayObj
    return newDataObj;
}
export const getNewEmpId = (dataObj) => {
    let largestId = null;
    for (const employee of dataObj.employees) {
        const idNumber = parseInt(employee.id.substring(3));
        if (largestId === null || idNumber > parseInt(largestId.substring(3))) {
            largestId = employee.id;
        }
    }
    const newEmpId = parseInt(largestId.substring(3)) + 1;
    const newEmpIdStr = (newEmpId).toString().length <= 2 ?
        "0".concat((newEmpId).toString())
        : (newEmpId).toString();
    return largestId.substring(0, 3).concat(newEmpIdStr)

}

export const validationIcon = (inputElement, flag, errorMsgContent = "") => {
    const validationIcon = inputElement.nextElementSibling;
    const errorMsg = inputElement.parentNode.nextElementSibling;

    if (flag) {
        validationIcon.innerHTML = `<i class="fa fa-warning input-icon-val" style="color:red"></i>`
        errorMsg.classList.remove("no-display")
        errorMsg.innerHTML = errorMsgContent
    }
    else {
        validationIcon.innerHTML = `<i class="fa fa-check input-icon-val" style="color:green"></i>`;
        errorMsg.classList.add("no-display")
    }

}
// Function to validate a required field
export const validateRequired = (inputElement) => {
    if (inputElement.hasAttribute("required") && inputElement.value === "") {
        return "This is a required field.";
    }
    return null;
}
// Function to validate text input
export const validateText = (inputElement) => {
    const inputValue = inputElement.value;
    if (inputValue.length < 2) {
        return "The entry must have a length of at least 2.";
    }
    if (!/^[A-Za-z\s'.-]+$/.test(inputValue)) {
        return "The field can have alphabets, spaces, single quotes, hyphens, and periods.";
    }
    return null;
}
// Function to validate text input
export const validateEmail = (inputElement) => {
    if (!inputElement.checkValidity()) {
        return "The entry is not a valid email.";
    }
    return null;
}
// Function to validate telephone input
export const validateTel = (inputElement) => {
    const inputValue = inputElement.value;
    if (inputValue.length !== 10) {
        return "The entry should have a length of 10.";
    }
    if (!/^[0-9]*$/.test(inputValue)) {
        return "This field can only have numeric data.";
    }
    return null;
}
// Function to validate date input
export const validateDate = (inputElement) => {
    const enteredDate = new Date(inputElement.value);
    const today = new Date();
    if (enteredDate >= today) {
        return "The entry must not exceed today.";
    }
    return null;
}
//Function to validate select box
export const validateSelect = (inputElement) => {
    const index = inputElement.selectedIndex;
    const selectedOption = inputElement.options[index];
    if (selectedOption.disabled) {
        return "This is a required field."
    }
    return null
}
//Function to validate skills
export const validateSkills = () => {
    let errorMessage = null;
    if (!skillsFormEntrySelectedList.hasChildNodes()) {
        errorMessage = "This is a required field."
    }
    validationIcon(skillsList, errorMessage !== null, errorMessage);
    return errorMessage === null
}
// Form Validation
export const handleValidation = (inputElement) => {
    let errorMessage = null;

    if (!inputElement.hasAttribute("required")) {
        return; // Skip non-required inputs
    }

    if (inputElement.type === "email") {
        errorMessage = validateEmail(inputElement)
    }
    else if (inputElement.type === "text") {
        errorMessage = validateRequired(inputElement) ? validateRequired(inputElement) : validateText(inputElement);
    } else if (inputElement.type === "tel") {
        errorMessage =validateRequired(inputElement) ? validateRequired(inputElement) : validateTel(inputElement);
    } else if (inputElement.type === "date") {
        errorMessage = validateRequired(inputElement) ? validateRequired(inputElement) :validateDate(inputElement);
    } else if (inputElement.tagName === "SELECT") {
        errorMessage =validateRequired(inputElement) ? validateRequired(inputElement) : validateSelect(inputElement);
    }

    if (errorMessage === null) {
        errorMessage = validateRequired(inputElement);
    }
    validationIcon(inputElement, errorMessage !== null, errorMessage);
    return errorMessage === null
}