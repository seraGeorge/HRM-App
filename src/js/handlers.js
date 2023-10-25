import { state } from "./context.js";
import { genderOtherVal, loader, otherEntryField, overlay, snackbar, snackbarDetails, snackbarIcon, snackbarTitle, sortIcon, submitBtn, tableData } from "./elements.js";
import { getDate, isValidDateFormat } from "./helperFunctions.js";
import { handleValidation } from "./validationService.js";

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
export const toggleBtn = (button, popUp, isModal = false) => {
    button.addEventListener("click", () => {
        popUp.classList.toggle("no-display")
        if (isModal) {
            removeOverlay(popUp)
        }
    })
}
//Function to remove overlay onClick
export const removeOverlay = (popUp) => {
    popUp.classList.add("no-display")
    overlay.classList.remove("open")
}
//Function to add overlay on button click
export const addOverlay = (popUp) => {
    popUp.classList.remove("no-display")
    overlay.classList.add("open")
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
export const updateButtonStyle = () => {
    let hasChanged = state.form.isValid && state.form.hasChanged && !state.form.isEmpty;
    submitBtn.style.opacity = hasChanged ? "1" : "0.3";
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
//Function to check radio buttons while editing the form
export const checkRadioBtn = (empGenderEntryToBeChecked, gender) => {
    if (empGenderEntryToBeChecked === undefined) {
        otherEntryField.classList.remove("no-display");
        otherEntryField.value = gender;
        genderOtherVal.checked = true;
    }
    else {
        empGenderEntryToBeChecked.checked = true;
    }
}
//Function to check if any input is invalid or not
export const checkValidity = () => {
    const inputElements = form.querySelectorAll(".input");
    let errorCount = 0;
    inputElements.forEach((inputElement) => {
        const isValid = handleValidation(inputElement);
        if ((isValid !== undefined) && !isValid) {//error is present
            errorCount++
        }
    })
    if (!validateSkills()) {// error is present
        errorCount++
    }
    return errorCount;
}
//Function to show Snackbar
export const showSnackbar = (icon, title, details) => {
    snackbar.classList.add("show");
    snackbarIcon.innerHTML = icon;
    snackbarTitle.innerHTML = title;
    snackbarDetails.innerHTML = details;
    if (title === "Error") {
        snackbar.style.borderColor = "red"
        snackbarTitle.style.color = "red"
    }
    else {
        snackbar.style.borderColor = "green"
        snackbarTitle.style.color = "green"
    }
    setTimeout(function () {
        snackbar.classList.remove("show")
        snackbarIcon.innerHTML = "";
        snackbarTitle.innerHTML = "";
        snackbarDetails.innerHTML = ""
    }, 3000);
}
// Function to parse query parameters from the URL
export const getQueryParam = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}
