import { dateList, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, submitBtnText, } from "./elements.js";
import { updateUserData } from "./firebase.js";
import { getNewEmpId, getNewEmployeeDetails, handleFormChange, handleValidation, hasFormChanged, hideDropdownIfNotTarget, setFormValue, setOptionsList, showSnackbar, toggleBtn, updateButtonStyle, validateDate, validateRequired, validateSelect, validateSkills, validateTel, validateText, validationIcon } from "./handlers.js";
import { getDate, isValidDateFormat } from "./helperFunctions.js";
import { addSelection, setDropDown } from "./setFilterDropdownData.js";
import { form, genderOtherVal, otherEntryField, submitBtn, designationSelectInput, departmentSelectInput, empModeSelectInput, genderRadiobuttons } from "./elements.js"

const dataStr = localStorage['data'];
const empIdToEdit = localStorage["empId"]
if (dataStr !== undefined) {

    const dataObj = JSON.parse(dataStr)

    //dropdown data setting
    const { designations: designationsDataList, departments: departmentsDataList, employment_modes: empModeDataList }
        = dataObj
    setOptionsList(designationsDataList, designationSelectInput)
    setOptionsList(departmentsDataList, departmentSelectInput)
    setOptionsList(empModeDataList, empModeSelectInput)

    //Skill custom dropdown
    const skillsDataList = dataObj.skills.map((e) => e.name)
    toggleBtn(skillsFormEntryBtn, skillsFormEntryList)
    setDropDown(skillsDataList, skillsFormEntryList, skillsFormEntrySelectedList, "skills-select")

    //Other Entry
    let closestInpGrp = otherEntryField.closest(".input-grp");
    closestInpGrp.style.border = "none"
    genderOtherVal.addEventListener("click", () => {
        closestInpGrp.classList.remove("no-display");
    })
    genderRadiobuttons.forEach((genderRadioBtn) => {
        genderRadioBtn.addEventListener("click", (event) => {
            if (!genderOtherVal.contains(event.target)) {
                otherEntryField.value = ""
                closestInpGrp.classList.add("no-display");
                otherEntryField.nextElementSibling.innerHTML = ""//sets " " each time other button is clicked
            }
        })
    })

    //Setting max date for all date fields
    dateList.forEach((date) => {
        const today = new Date().toISOString().split("T")[0];
        date.setAttribute("max", today);
    })


    // Form Input Interactions
    form.addEventListener("input", (event) => {
        handleValidation(event.target)
    });


    if (empIdToEdit == undefined) { // adding new employee
        //Adding new Employee

        skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
            validateSkills()
        });

        pageTitle.innerHTML = "Add New employee"
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
                let newDataObj = getNewEmployeeDetails(formDataObj, dataObj);
                newDataObj.id = getNewEmpId(dataObj)
                try {
                    await updateUserData('/employees', newDataObj, dataObj.employees.length)
                }
                catch (error) {
                    console.error("Error on updating the data")
                }
                finally {
                    submitBtn.classList.remove("loader");
                    const snackbarTxt = newDataObj.emp_name + " has been added";
                    window.location.href = "../../index.html?snackbarMessage=" + encodeURIComponent(snackbarTxt);
                }
                return false;
            }
            else {
                submitBtn.classList.remove("loader");
            }
        })

    }
    else if (empIdToEdit !== undefined) {//editing existing employee
        //Editing a Employee
        pageTitle.innerHTML = "Update Details of a employee"
        submitBtnText.innerHTML = "Save"

        // Set employee details
        const empToEdit = dataObj.employees.find((employee) => employee.id === empIdToEdit);
        const empToEditArrayIndex = dataObj.employees.findIndex((employee) => employee.id === empIdToEdit);

        //Setting form values
        setFormValue("name", empToEdit.emp_name);
        setFormValue("email", empToEdit.email);
        setFormValue("phone", empToEdit.phone);
        setFormValue("address", empToEdit.address);

        const dobValue = isValidDateFormat(empToEdit.date_of_birth) ? getDate(empToEdit.date_of_birth) : empToEdit.date_of_birth;
        setFormValue("date_of_birth", dobValue);

        const dojValue = isValidDateFormat(empToEdit.date_of_joining) ? getDate(empToEdit.date_of_joining) : empToEdit.date_of_joining;
        setFormValue("date_of_joining", dojValue);

        setFormValue("designation", empToEdit.designation);
        setFormValue("department", empToEdit.department);
        setFormValue("employment_mode", empToEdit.employment_mode);

        //Employee Gender value setting
        let empGenderEntryToBeChecked;
        if (["Male", "Female"].includes(empToEdit.gender)) {
            empGenderEntryToBeChecked = Array.from(genderRadiobuttons).find((empGenderEntry) => {
                return empGenderEntry.value === empToEdit.gender
            });
        }
        else {
            //handling other gender cases
            empGenderEntryToBeChecked = genderOtherVal;
            otherEntryField.parentNode.classList.remove("no-display");
            otherEntryField.value = empToEdit.gender;
        }
        empGenderEntryToBeChecked.checked = true;

        //Employee Skills value setting
        empToEdit.skills.forEach((skill) => {
            const listItems = skillsFormEntryList.querySelectorAll("li");
            const listItem = Array.from(listItems).find((listItem) => {
                return listItem.innerHTML.includes(skill.name);
            })
            addSelection(skill.name, listItem, skillsFormEntrySelectedList, skillsFormEntryList, "skills-select")
        })

        //Button is disabled if there is no change in the data
        let hasChanged = false;
        let formDataObj = {};
        updateButtonStyle(submitBtn, hasChanged);

        // Event listener for skills form selection changes
        skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
            if (handleFormChange(formDataObj, empToEdit, dataObj, submitBtn)) {
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
                let newDataObj = getNewEmployeeDetails(formDataObj, dataObj);
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

