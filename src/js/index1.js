import { empDOBVal, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList } from "./elements.js";
import { updateUserData, writeUserData } from "./firebase.js";
import { hasFormChanged, hideDropdownIfNotTarget, setFormValue, setOptionsList, toggleBtn, updateButtonStyle } from "./handlers.js";
import { getDate, isValidDateFormat } from "./helperFunctions.js";
import { addSelection, createListItem, setDropDown } from "./setFilterDropdownData.js";
import { setTableData } from "./setTable.js";

export const form = document.querySelector("#form")
export const genderOtherVal = document.querySelector("#gender-other-entry");
export const otherEntryField = document.querySelector("#gender_other_val");
export const submitBtn = document.querySelector("#submit-btn")
export const genderSelectedValue = document.querySelector('input[name="gender"]:checked');
export const skills = document.querySelectorAll("#skills-select .chip-heading")
export const designationSelectEntry = document.querySelector("#designation")
export const departmentSelectEntry = document.querySelector("#department")
export const empModeSelectEntry = document.querySelector("#employment_mode")
export const genderRadiobuttons = document.querySelectorAll(".gender");

const source = localStorage["source"];
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
    genderOtherVal.addEventListener("click", () => {
        otherEntryField.classList.remove("no-display");
    })
    genderRadiobuttons.forEach((genderRadioBtn) => {
        genderRadioBtn.addEventListener("click", (event) => {
            if (!genderOtherVal.contains(event.target)) {
                otherEntryField.value = ""
                otherEntryField.classList.add("no-display");
            }
        })
    })






    const empToEdit = dataObj.employees.find((employee) => employee.id === empIdToEdit);

    if (source == "add") {
        pageTitle.innerHTML = "Add New employee"
    }
    else if (source == "edit") {
        pageTitle.innerHTML = "Update Details of a employee"
        submitBtn.innerHTML = "Save"
        // Set employee details
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
        const empGenderEntryList = document.getElementsByName("gender");
        let empGenderEntryToBeChecked;
        if (["Male", "Female"].includes(empToEdit.gender)) {
            empGenderEntryToBeChecked = Array.from(empGenderEntryList).find((empGenderEntry) => {
                return empGenderEntry.value === empToEdit.gender
            });
        }
        else {
            //handling other gender cases
            empGenderEntryToBeChecked = genderOtherVal;
            otherEntryField.classList.remove("no-display");
            otherEntryField.value = empToEdit.gender.toString();
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

    }


    let hasChanged = false;
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


    //Form submission
    let formDataObj = {};
    let newDataObj = {};

    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();


        //Set new Data
        newDataObj.emp_name = formDataObj.name;
        newDataObj.email = formDataObj.email;
        newDataObj.phone = formDataObj.phone;
        newDataObj.address = formDataObj.address;
        newDataObj.date_of_birth = formDataObj.date_of_birth;
        newDataObj.date_of_joining = formDataObj.date_of_joining;
        newDataObj.designation = formDataObj.designation;
        newDataObj.department = formDataObj.department;
        newDataObj.employment_mode = formDataObj.employment_mode;
        newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender_other_val : formDataObj.gender;
        const skillsTagList = document.querySelectorAll(".chip");
        const skillValues = Array.from(skillsTagList).map((skillTag) => skillTag.querySelector(".chip-heading").innerHTML);
        const skillArrayObj = dataObj.skills.filter(skill => skillValues.includes(skill.name))
        newDataObj.skills = skillArrayObj
        if (hasChanged) {
            let largestId = null;
            for (const employee of dataObj.employees) {
                const idNumber = parseInt(employee.id.substring(3));
                if (largestId === null || idNumber > parseInt(largestId.substring(3))) {
                    largestId = employee.id;
                }
            }
            const newEmpId = parseInt(largestId.substring(3)) + 1;
            const newEmpIdStr = (newEmpId).toString().length <= 2 ?
                "0".concat((newEmpId).toString())
                : (newEmpId).toString();
            newDataObj.id = largestId.substring(0, 3).concat(newEmpIdStr)
            //TODO: Add Logic for validity
            //TODO: Custom Validation design elements
            //TODO: Alert box for success
            //TODO: Alert box for error
            await updateUserData('/employees', newDataObj, dataObj.employees.length)
            history.back();
            return false;
        }

    })

    document.addEventListener("click", (event) => {
        hideDropdownIfNotTarget(skillsFormEntryList, skillsFormEntryBtn, event);
    })

}
else {
    console.error("Error occurred.");
}

