import { body, deleteModal, loader, overlay, skillsFormEntrySelectedList, skillsList, snackbar, sortIcon, tableData, year } from "./elements.js";
import { getDate, getYear, isValidDateFormat, sortCriteria, sortFn } from "./helperFunctions.js";

//Function to show loader until data is fetched
export const displayLoading = () => {
    loader.classList.remove("no-display");
    tableData.style.display = "none"
}
//Function to add loader when data is fetched
export const hideLoading = () => {
    loader.classList.add("no-display");
    tableData.style.display = "table"

}
//Function to add sort icon
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
//Function to toggle dropdowns
export const toggleBtn = (button, popUp) => {
    button.addEventListener("click", () => {
        popUp.classList.toggle("no-display")
    })
}
// Function to format the date
export const formatDate = (dateString) => {
    return isValidDateFormat(dateString) ? getDate(dateString) : dateString;
}
// Function to get selected skills from the dropdown
export const getSelectedSkills = (skills) => {
    const skillsTagList = document.querySelectorAll(".chip");
    const skillValues = Array.from(skillsTagList).map((skillTag) => skillTag.querySelector(".chip-heading").innerHTML);
    return skills.filter(skill => skillValues.includes(skill.name));
}
//Function to disable and enable button style
export const updateButtonStyle = (submitBtn, hasChanged) => {
    submitBtn.style.opacity = hasChanged ? "1" : "0.3";
    submitBtn.disabled = !hasChanged;
}
//Function to add icons while validating input
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
//Function to show Snackbar
export const showSnackbar = (snackbarTxt) => {
    snackbar.classList.add("show");
    snackbar.innerHTML = snackbarTxt

    setTimeout(function () {
        snackbar.classList.remove("show")
        snackbar.innerHTML = ""
    }, 1000);
}
// Function to parse query parameters from the URL
export const getQueryParam = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}
