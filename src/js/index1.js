import { clearBtn, inpErrorMsg, inpValidateIcon, otherEntryField, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, submitBtnText, } from "./elements.js";
import { getSelectedSkills, showSnackbar, updateButtonStyle, } from "./handlers.js";
import { hasSkillArrayChanged } from "./helperFunctions.js";
import { hideDropdownIfNotTarget } from "./dropdown.js";
import { form, submitBtn } from "./elements.js"
import { setFormUI, setFormData, submitForm, hasFormChanged } from "./formInteractions.js";
import { getLatestFormData, getNewEmpId } from "./formInput.js";
import { checkFormValidity, isElligibleToSubmit, validateSkills } from "./validationService.js";
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
        localStorage.removeItem("empId");
        state.form.errorMsg = "No changes have been made.<br/>You are attempting to submit the same employee details that are already saved"
    }
    else {
        state.form.errorMsg = "Enter all the required fields correctly."
    }


    // Form Input Interactions
    form.addEventListener("input", (event) => {
        isElligibleToSubmit(event.target, empToEdit, dataObj.skills);
    });
    // Event listener for skills form selection changes
    skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
        isElligibleToSubmit(event.target, empToEdit, dataObj.skills);
    });

    clearBtn.addEventListener("click", (event) => {
        state.form.isEmpty = true;
        state.form.errorMsg = "Empty form can't be submitted"
        inpErrorMsg.forEach((errorMsg) =>
            errorMsg.classList.add("no-display")
        )
        inpValidateIcon.forEach((valIcon) => {
            valIcon.innerHTML = ""
        })
        otherEntryField.classList.add("no-display")
        skillsFormEntrySelectedList.innerHTML = ""
        updateButtonStyle();
    })
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        submitBtn.classList.add("loader")
        //Check if valid to add employee
        if (state.form.isValid && state.form.hasChanged && !state.form.isEmpty) {
            if (!empToEdit) {
                submitForm(getNewEmpId(dataObj.employees), dataObj.employees.length, dataObj.skills, "added")
            }
            else {
                submitForm(empIdToEdit, empToEditArrayIndex, dataObj.skills, "edited")
            }
        }
        else {
            if (state.form.errorMsg) {
                showSnackbar("cancel", "Error", state.form.errorMsg);
            }
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