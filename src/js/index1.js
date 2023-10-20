import { dateList, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, submitBtnText, } from "./elements.js";
import { updateUserData } from "./firebase.js";
import { checkRadioBtn, toggleBtn, updateButtonStyle, } from "./handlers.js";
import { getDate, isValidDateFormat } from "./helperFunctions.js";
import { addSelection, hideDropdownIfNotTarget, setDropDown } from "./dropdown.js";
import { form, genderOtherVal, otherEntryField, submitBtn, designationSelectInput, departmentSelectInput, empModeSelectInput, genderRadiobuttons } from "./elements.js"
import { handleFormChange, setFormUI, setFormInput, setOptionsList, setFormData, submitForm } from "./formInteractions.js";
import { getNewEmpId, getNewEmployeeDetails } from "./formInput.js";
import { handleValidation, validateSkills } from "./validationService.js";

const dataStr = localStorage['data'];
const empIdToEdit = localStorage["empId"]

if (dataStr !== undefined) {

    const dataObj = JSON.parse(dataStr)

    setFormUI(dataObj);
    pageTitle.innerHTML = empIdToEdit ? "Update Details of a employee" : "Add New employee";
    submitBtnText.innerHTML = empIdToEdit ? "Save" : "Submit"


    form.addEventListener("input", (event) => {
        handleValidation(event.target)
    });

    if (empIdToEdit == undefined) {
        // adding new employee

        // Form Input Interactions

        skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
            validateSkills()
        });


        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();
            submitBtn.classList.add("loader")
            //Check if valid to add employee
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
            if (errorCount == 0) {
                const updateIndex = dataObj.employees.length;
                const id = getNewEmpId(dataObj.employees);
                submitForm(id, updateIndex, dataObj.skills)
            }
            else {
                submitBtn.classList.remove("loader");
            }
        })

    }
    else if (empIdToEdit !== undefined) {
        //editing existing employee

        // Set employee details
        const empToEdit = dataObj.employees.find((employee) => employee.id === empIdToEdit);
        const empToEditArrayIndex = dataObj.employees.findIndex((employee) => employee.id === empIdToEdit);

        //Setting form values
        setFormData(empToEdit);

        //Button is disabled if there is no change in the data
        let hasChanged = false;
        updateButtonStyle(submitBtn, hasChanged);


        // Event listener for skills form selection changes
        skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
            if (handleFormChange(empToEdit, dataObj.skills, submitBtn)) {
                validateSkills();
            }
        });


        submitBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            submitBtn.classList.add("loader")
            //Check if valid to add employee
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

            if (errorCount == 0) {
                let formDataObj = {};
                const formData = new FormData(form);
                formData.forEach((value, key) => (formDataObj[key] = value));
                let newDataObj = getNewEmployeeDetails(formDataObj, dataObj.skills);
                try {
                    await updateUserData('/employees', newDataObj, empToEditArrayIndex)
                }
                catch (error) {
                    console.error("Error on updating the data")
                }
                finally {
                    submitBtn.classList.remove("loader");
                    const snackbarTxt = empToEdit.emp_name + " has been edited";
                    window.location.href = "../../index.html?snackbarMessage=" + encodeURIComponent(snackbarTxt);
                }
                return false;
            }
            else {
                submitBtn.classList.remove("loader");
            }

        })

        localStorage.removeItem("empId")

    }

    document.addEventListener("click", (event) => {
        hideDropdownIfNotTarget(skillsFormEntryList, skillsFormEntryBtn, event);
    })

}
else {
    console.error("Error occurred.");
}

