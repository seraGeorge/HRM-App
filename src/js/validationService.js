import { state } from "./context.js";
import { genderOtherVal, genderRadiobuttons, inputs, otherEntryField, skillsFormEntrySelectedList, skillsList } from "./elements.js";
import { hasFormChanged } from "./formInteractions.js";
import { updateButtonStyle, validationIcon } from "./handlers.js";

// Function to validate a required field
const validateRequired = (inputElement) => {
    if (inputElement.hasAttribute("required") && inputElement.value === "") {
        return "This is a required field.";
    }
    return null;
}
// Function to validate text input
const validateText = (inputElement) => {
    const inputValue = inputElement.value;
    if (inputValue.length < 2) {
        return "Please ensure that your entry is at least 2 characters long.";
    }
    if ((!/^[A-Za-z\s'.-]+$/.test(inputValue)) && (inputElement.tagName != "TEXTAREA")) {
        return "The field should contain only alphabets, spaces, single quotes, hyphens, and periods.";
    }
    if (/^\s*$/.test(inputValue)) {
        return "Kindly provide a meaningful content for this field, meeting the specified criteria.";
    }
    return null;
}
// Function to validate email input
const validateEmail = (inputElement) => {
    if (!inputElement.checkValidity()) {
        return "Please ensure that you have entered a valid email.";
    }
    return null;
}
// Function to validate telephone input
const validateTel = (inputElement) => {
    const inputValue = inputElement.value;
    if (inputValue.length !== 10) {
        return "Please ensure that your entry is at least 10 numbers long.";
    }
    if (!/^[0-9]*$/.test(inputValue)) {
        return "This field should contain only numeric data.";
    }
    return null;
}
// Function to validate date input
const validateDate = (inputElement) => {
    const enteredDate = new Date(inputElement.value);
    const today = new Date();
    if (enteredDate >= today) {
        return "Please ensure that the entered date is not later than today's date.";
    }
    return null;
}
//Function to validate select box
const validateSelect = (inputElement) => {
    const index = inputElement.selectedIndex;
    const selectedOption = inputElement.options[index];
    if (selectedOption.disabled) {
        return "This is a required field."
    }
    return null
}
//Function to validate radio
const findSelectedRadioBtn = () => {
    const selectedGrade = Array.from(genderRadiobuttons).filter(radioBtn =>
        radioBtn.checked == true
    );
    return selectedGrade.length;
}
const validateRadio = (inputElement) => {
    if (inputElement.checked) {
        if (inputElement.value === "Other") {
            otherEntryField.setAttribute("required", true)
        }
        else {
            otherEntryField.removeAttribute("required")
        }
    }
    if (findSelectedRadioBtn() === 0) {
        return "This is a required field."
    }
    return null
}
//Function to validate skills
export const validateSkills = (currentInputElement) => {
    let errorMessage = null;
    if (!skillsFormEntrySelectedList.hasChildNodes()) {
        errorMessage = "This is a required field."
    }
    if (currentInputElement.id === skillsFormEntrySelectedList.id) {
        validationIcon(skillsList, errorMessage !== null, errorMessage);
    }
    return errorMessage === null
}
// Validating each form input
export const handleValidation = (inputElement, currentInputElement) => {
    let errorMessage = null;
    if (!inputElement.hasAttribute("required")) {
        if (inputElement.type === "radio") {//radio buttons are unrequired
            errorMessage = validateRadio(inputElement)
        }
        else {
            return true;// ignoring gender other entry when it has required=false
        }
    }
    else {
        errorMessage = validateRequired(inputElement);
        if (errorMessage === null) {
            if (inputElement.type === "email") {
                errorMessage = validateEmail(inputElement)
            }
            else if (inputElement.type === "text") {
                errorMessage = validateText(inputElement);
            } else if (inputElement.type === "tel") {
                errorMessage = validateTel(inputElement);
            } else if (inputElement.type === "date") {
                errorMessage = validateDate(inputElement);
            } else if (inputElement.tagName === "SELECT") {
                errorMessage = validateSelect(inputElement);
            } else if (inputElement.tagName === "TEXTAREA") {
                errorMessage = validateText(inputElement);
            }
        }
    }
    if (inputElement.id === currentInputElement.id) {
        if ((inputElement.type === "radio") || (inputElement.id === "gender_other_val")) {
            validationIcon(inputElement.parentNode.parentNode, errorMessage !== null, errorMessage);
        }
        else {
            validationIcon(inputElement, errorMessage !== null, errorMessage);
        }
    }
    return errorMessage === null
}

// Create a function to check the validity of all form inputs
export const checkFormValidity = (currentInputElement) => {
    let isFormValid = true;
    let isCurrentElementValid;
    inputs.forEach(input => {
        isCurrentElementValid = handleValidation(input, currentInputElement)
        isFormValid = isFormValid && isCurrentElementValid;
    });
    let isSkillsValid = validateSkills(currentInputElement);
    let isValid = isFormValid && isSkillsValid
    return isValid;
}
export const isElligibleToSubmit = (currentInputElement, empToEdit, skills) => {
    state.form.isEmpty = false;
    let hasChanged = false;
    const isValid = checkFormValidity(currentInputElement);
    state.form.isValid = isValid;
    if (empToEdit) {
        //Button is disabled if there is no change in the data
        hasChanged = hasFormChanged(empToEdit, skills);
        state.form.hasChanged = hasChanged;
        if (!hasChanged) {
            state.form.errorMsg = "No changes have been made.<br/>You are attempting to submit the same employee details that are already saved";
        }
        if (!isValid) {
            state.form.errorMsg = "Enter all the required fields correctly."
        }
    }
    updateButtonStyle();
}