import { pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, submitBtnText, } from "./elements.js";
import { getSelectedSkills, showSnackbar, updateButtonStyle, } from "./handlers.js";
import { hasSkillArrayChanged } from "./helperFunctions.js";
import { hideDropdownIfNotTarget } from "./dropdown.js";
import { form, submitBtn } from "./elements.js"
import { setFormUI, setFormData, submitForm, hasFormChanged } from "./formInteractions.js";
import { getLatestFormData, getNewEmpId } from "./formInput.js";
import { checkFormValidity, validateSkills } from "./validationService.js";
import { state } from "./context.js";

const dataStr = localStorage['data'];
const empIdToEdit = localStorage["empId"]

if (dataStr !== undefined) {

    const dataObj = JSON.parse(dataStr)

    setFormUI(dataObj);
    pageTitle.innerHTML = empIdToEdit ? "Update Details of a employee" : "Add New employee";
    submitBtnText.innerHTML = empIdToEdit ? "Save" : "Submit"

    let empToEdit;
    let empToEditArrayIndex;
    if (empIdToEdit) {
        // Set employee details
        empToEdit = dataObj.employees.find((employee) => employee.id === empIdToEdit);
        empToEditArrayIndex = dataObj.employees.findIndex((employee) => employee.id === empIdToEdit);
        //Setting form values
        setFormData(empToEdit);
        localStorage.removeItem("empId")
    }


    // Form Input Interactions
    form.addEventListener("input", (event) => {
        let hasChanged = false;
        const isValid = checkFormValidity(event.target)
        state.form.isValid = isValid;
        if (empIdToEdit) {

            //Getting latest form data
            const formDataObj = getLatestFormData();

            //Button is disabled if there is no change in the data
            hasChanged = hasFormChanged(formDataObj, empToEdit);
            state.form.hasChanged = hasChanged;
            if (!hasChanged) {
                state.form.errorMsg = "No need to resubmit an unedited employee details. It is saved already"
            }
            if (!isValid) {
                state.form.errorMsg = "There has been an invalid entry. Please do rectify it."
            }
        }
        updateButtonStyle();
    });
    // Event listener for skills form selection changes
    skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
        let hasChanged = false;
        const isValid = validateSkills();
        state.form.isValid=isValid
        if (empIdToEdit) {
            //Button is disabled if there is no change in the data
            hasChanged = !hasSkillArrayChanged(getSelectedSkills(dataObj.skills), empToEdit.skills);
            state.form.hasChanged= hasChanged;
            if (!hasChanged) {
                state.form.errorMsg = "No need to resubmit an unedited employee details. It is saved already"
            }
            if (!isValid) {
                state.form.errorMsg = "There has been an invalid entry. Please do rectify it."
            }
        }

        updateButtonStyle();
    });


    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        submitBtn.classList.add("loader")
        //Check if valid to add employee
        if (state.form.isValid && state.form.hasChanged) {
            if (!empToEdit) {
                submitForm(getNewEmpId(dataObj.employees), dataObj.employees.length, dataObj.skills, "added")
            }
            else {
                submitForm(empIdToEdit, empToEditArrayIndex, dataObj.skills, "edited")
            }
        }
        else {
            if (state.form.errorMsg != "")
                showSnackbar(state.form.errorMsg);
            submitBtn.classList.remove("loader");
        }
    })

    document.addEventListener("click", (event) => {
        hideDropdownIfNotTarget(skillsFormEntryList, skillsFormEntryBtn, event);
    })

}
else {
    console.error("Error occurred.");
}


