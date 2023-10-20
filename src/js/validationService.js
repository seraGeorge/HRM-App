import { skillsFormEntrySelectedList, skillsList } from "./elements.js";
import { validationIcon } from "./handlers.js";

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
        return "The entry must have a length of at least 2.";
    }
    if (!/^[A-Za-z\s'.-]+$/.test(inputValue)) {
        return "The field can have alphabets, spaces, single quotes, hyphens, and periods.";
    }
    return null;
}
// Function to validate email input
const validateEmail = (inputElement) => {
    if (!inputElement.checkValidity()) {
        return "The entry is not a valid email.";
    }
    return null;
}
// Function to validate telephone input
const validateTel = (inputElement) => {
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
const validateDate = (inputElement) => {
    const enteredDate = new Date(inputElement.value);
    const today = new Date();
    if (enteredDate >= today) {
        return "The entry must not exceed today.";
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
//Function to validate skills
export const validateSkills = () => {
    let errorMessage = null;
    if (!skillsFormEntrySelectedList.hasChildNodes()) {
        errorMessage = "This is a required field."
    }
    validationIcon(skillsList, errorMessage !== null, errorMessage);
    return errorMessage === null
}
// Validating each form input
export const handleValidation = (inputElement) => {
    let errorMessage = null;

    if (!inputElement.hasAttribute("required")) {
        return; // Skip non-required inputs
    }
    if (validateRequired(inputElement) === null) {
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
        }
    }

    if (errorMessage === null) {
        errorMessage = validateRequired(inputElement);
    }
    validationIcon(inputElement, errorMessage !== null, errorMessage);
    return errorMessage === null
}