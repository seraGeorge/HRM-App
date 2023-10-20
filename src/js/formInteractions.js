import { formatDate, getSelectedSkills, updateButtonStyle } from "./handlers.js";
import { arraysEqual } from "./helperFunctions.js";

//Setting options list for select tag
export const setOptionsList = (data, selectInput) => {
    data.forEach((value) => {
        const optionVal = document.createElement("option");
        optionVal.value = value;
        optionVal.innerHTML = value;
        selectInput.appendChild(optionVal);
    })
}
//On editing existing employee, setting the form input values
export const setFormValue = (inputId, value) => {
    const element = document.getElementById(inputId);
    if (element) {
        element.value = value;
    }
}
// On editing existing employee, function to check if any form field has changed
const hasFormChanged = (formDataObj, empToEdit, skills) => {
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
        genderFlag || !arraysEqual(getSelectedSkills(skills), empToEdit.skills)
    );
}
// On editing existing employee, function to handle button style on form change
export const handleFormChange = (empToEdit, skills, submitBtn) => {
    let formDataObj = {}
    // Getting the latest form data each time
    const formData = new FormData(form);
    formData.forEach((value, key) => (formDataObj[key] = value));

    // Check if the form has changed
    const hasChanged = hasFormChanged(formDataObj, empToEdit, skills);

    // Update the submit button style
    updateButtonStyle(submitBtn, hasChanged);

    return hasChanged;
}