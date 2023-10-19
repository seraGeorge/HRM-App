import { dateList, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList, skillsList } from "./elements.js";
import { updateUserData } from "./firebase.js";
import { getNewEmpId, getNewEmployeeDetails, handleValidation, hasFormChanged, hideDropdownIfNotTarget, setFormValue, setOptionsList, toggleBtn, updateButtonStyle, validateDate, validateRequired, validateSelect, validateSkills, validateTel, validateText, validationIcon } from "./handlers.js";
import { getDate, isValidDateFormat } from "./helperFunctions.js";
import { addSelection, setDropDown } from "./setFilterDropdownData.js";
import { form, genderOtherVal, otherEntryField, submitBtn, designationSelectEntry, departmentSelectEntry, empModeSelectEntry, genderRadiobuttons } from "./elements.js"

const dataStr = localStorage['data'];
const empIdToEdit = localStorage["empId"]
if (dataStr !== undefined) {

    const dataObj = JSON.parse(dataStr)

    //dropdown data setting
    const designationsDataList = dataObj.designations;
    const departmentsDataList = dataObj.departments;
    const empModeDataList = dataObj.employment_modes;
    setOptionsList(designationsDataList, designationSelectEntry)
    setOptionsList(departmentsDataList, departmentSelectEntry)
    setOptionsList(empModeDataList, empModeSelectEntry)

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
    skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
        validateSkills()
    });



    if (empIdToEdit == undefined) { // editing existing employee
        //Adding new Employee
        pageTitle.innerHTML = "Add New employee"
        submitBtn.addEventListener("click", async (event) => {
            event.preventDefault();

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
                console.log(newDataObj)
                await updateUserData('/employees', newDataObj, dataObj.employees.length)
                window.history.back();
                return false;
            }
        })

    }
    else if (empIdToEdit !== undefined) {
        //Editing a Employee
        pageTitle.innerHTML = "Update Details of a employee"
        submitBtn.innerHTML = "Save"

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
        form.addEventListener("input", (event) => {
            // Mark changes when any form input changes
            const formData = new FormData(form);
            formData.forEach((value, key) => (formDataObj[key] = value));
            hasChanged = hasFormChanged(formDataObj, empToEdit, dataObj)
            updateButtonStyle(submitBtn, hasChanged);
        });
        skillsFormEntrySelectedList.addEventListener("selectionChange", (event) => {
            // Mark changes when any skill input changes
            const formData = new FormData(form);
            formData.forEach((value, key) => (formDataObj[key] = value));
            hasChanged = hasFormChanged(formDataObj, empToEdit, dataObj)
            updateButtonStyle(submitBtn, hasChanged);
        });

        submitBtn.addEventListener("click", async (event) => {
            event.preventDefault();

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
                console.log(newDataObj)
                await updateUserData('/employees', newDataObj, dataObj.employees.length)
                window.history.back();
                return false;
            }

            //Set new Data
            if (isUpdate) {

                let newDataObj = getNewEmployeeDetails(formDataObj, dataObj);
                //Set new Data
                if (hasChanged) {
                    await updateUserData('/employees', newDataObj, empToEditArrayIndex)
                    window.history.back();
                    return false;
                }
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

