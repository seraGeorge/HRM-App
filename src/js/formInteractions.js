import { addSelection, setDropDown } from "./dropdown.js";
import { dateList, departmentSelectInput, designationSelectInput, empModeSelectInput, genderOtherVal, genderRadiobuttons, otherEntryField, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, submitBtn } from "./elements.js";
import { updateUserData } from "./firebase.js";
import { getLatestFormData, getNewEmployeeDetails } from "./formInput.js";
import { checkRadioBtn, formatDate, toggleBtn } from "./handlers.js";
import {  getDate, isValidDateFormat } from "./helperFunctions.js";

//Set up basic ui for the form
export const setFormUI = (dataObj) => {
    //dropdown data setting
    const { designations, departments, employment_modes } = dataObj;
    const skillsDataList = dataObj.skills.map((e) => e.name)

    initialiseDropdowns(designations, departments, employment_modes, skillsDataList)//initialising form dropdowns
    toggleBtn(skillsFormEntryBtn, skillsFormEntryList)// toggle entrylist on clicking the btn

    // open other gender entry on clicking other radio btn
    genderRadiobuttons.forEach((genderRadioBtn) => {
        genderRadioBtn.addEventListener("click", (event) => {
            if (!genderOtherVal.contains(event.target)) {
                //if a radio button other than male or female is clicked, other field and entry is reset
                otherEntryField.value = ""
                otherEntryField.classList.add("no-display");
            }
            else {
                otherEntryField.classList.remove("no-display");
            }
        })
    })

    //Setting max date for all date fields
    dateList.forEach((date) => {
        const today = new Date().toISOString().split("T")[0];
        date.setAttribute("max", today);
    })
}
//Initialising form dropdowns
export const initialiseDropdowns = (designations, departments, employment_modes, skillsDataList) => {
    //set options for corrresponding select tags
    setOptionsList(designations, designationSelectInput)
    setOptionsList(departments, departmentSelectInput)
    setOptionsList(employment_modes, empModeSelectInput)
    //set skills custom dropdown with skills
    setDropDown(skillsDataList, skillsFormEntryList, skillsFormEntrySelectedList, "skills-select")
}
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
export const setFormInput = (formData) => {
    for (const key in formData) {
        const element = document.getElementById(key);
        if (element) {
            element.value = formData[key];
        }
    }
}
//On editing existing employee, setting the form
export const setFormData = (empToEdit) => {

    const dobValue = !isValidDateFormat(empToEdit.date_of_birth) ? empToEdit.date_of_birth : getDate(empToEdit.date_of_birth);
    const dojValue = !isValidDateFormat(empToEdit.date_of_joining) ? empToEdit.date_of_joining : getDate(empToEdit.date_of_joining);
    const formData = {
        "name": empToEdit.emp_name,
        "email": empToEdit.email,
        "phone": empToEdit.phone,
        "address": empToEdit.address,
        "date_of_birth": dobValue,
        "date_of_joining": dojValue,
        "designation": empToEdit.designation,
        "department": empToEdit.department,
        "employment_mode": empToEdit.employment_mode,
    }
    setFormInput(formData);

    //setting radio button
    let empGenderEntryToBeChecked = Array.from(genderRadiobuttons).find((empGenderEntry) => empGenderEntry.value === empToEdit.gender);
    checkRadioBtn(empGenderEntryToBeChecked, empToEdit.gender);


    //Employee Skills value setting
    empToEdit.skills.forEach((skill) => {
        const listItems = skillsFormEntryList.querySelectorAll("li");
        const listItem = Array.from(listItems).find((listItem) => {
            return listItem.innerHTML.includes(skill.name);
        })
        addSelection(skill.name, listItem, skillsFormEntrySelectedList, skillsFormEntryList, "skills-select")
    })

}
// On editing existing employee, function to check if any form field has changed
export const hasFormChanged = (formDataObj, empToEdit) => {
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
        genderFlag
    );
}
//Submitting the form
export const submitForm = async (id, index, skills, snackbarMsg) => {
    let formDataObj = getLatestFormData()
    let newDataObj = getNewEmployeeDetails(formDataObj, skills);
    newDataObj.id = id;
    try {
        await updateUserData('/employees', newDataObj, index)
    }
    catch (error) {
        console.error("Error on updating the data")
    }
    finally {
        submitBtn.classList.remove("loader");
        const snackbarTxt = newDataObj.emp_name + " has been " + snackbarMsg;
        window.location.href = "../../index.html?snackbarMessage=" + encodeURIComponent(snackbarTxt);
    }
}