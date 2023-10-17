import { empDOBVal, pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList } from "./elements.js";
import { updateUserData, writeUserData } from "./firebase.js";
import { hideDropdownIfNotTarget, setFormValue, setOptionsList, toggleBtn } from "./handlers.js";
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















    //Form submission
    let formDataObj = {};
    let newDataObj = {};

    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        //Get form data
        const formData = new FormData(form);
        formData.forEach((value, key) => (formDataObj[key] = value));
        console.log(empToEdit)
        // checkIfPreset(formDataObj.name, empToEdit);

        //Set new Data
        let hasChanged = false;
        newDataObj.emp_name = formDataObj.name;
        if (formDataObj.name !== empToEdit.emp_name) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.email = formDataObj.email;
        if (formDataObj.email !== empToEdit.email) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.phone = formDataObj.phone;
        if (formDataObj.phone !== empToEdit.phone) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.address = formDataObj.address;
        if (formDataObj.address !== empToEdit.address) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.date_of_birth = formDataObj.date_of_birth;
        if (formDataObj.date_of_birth !== empToEdit.date_of_birth) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.date_of_joining = formDataObj.date_of_joining;
        if (formDataObj.date_of_joining !== empToEdit.date_of_joining) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.designation = formDataObj.designation;
        if (formDataObj.designation !== empToEdit.designation) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.department = formDataObj.department;
        if (formDataObj.department !== empToEdit.department) {
            console.log("hi")
            hasChanged = true;
        }
        newDataObj.employment_mode = formDataObj.employment_mode;
        if (formDataObj.employment_mode !== empToEdit.employment_mode) {
            console.log("hi")
            hasChanged = true;
        }

        newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender_other_val : formDataObj.gender;
        if ((formDataObj.gender !== empToEdit.gender) || (formDataObj.gender_other_val !== empToEdit.gender)) {
            console.log("hi")
            hasChanged = true;
        }
        const skillsTagList = document.querySelectorAll(".chip");
        const skillValues = Array.from(skillsTagList).map((skillTag) => skillTag.querySelector(".chip-heading").innerHTML);
        const skillArrayObj = dataObj.skills.filter(skill => skillValues.includes(skill.name))
        newDataObj.skills = skillArrayObj
        // if (formDataObj.skills.length === empToEdit.length) { 
        //     if(formDataObj.every((value, index) => value === empToEdit[index])){
        //         hasChanged = true;
        //     }
        // }
        console.log(hasChanged)
        // if (hasChanged) {
        //     let largestId = null;
        //     for (const employee of dataObj.employees) {
        //         const idNumber = parseInt(employee.id.substring(3));
        //         if (largestId === null || idNumber > parseInt(largestId.substring(3))) {
        //             largestId = employee.id;
        //         }
        //     }
        //     const newEmpId = parseInt(largestId.substring(3)) + 1;
        //     const newEmpIdStr = (newEmpId).toString().length <= 2 ?
        //         "0".concat((newEmpId).toString())
        //         : (newEmpId).toString();
        //     newDataObj.id = largestId.substring(0, 3).concat(newEmpIdStr)
        //     //TODO: Add Logic for validity
        //     //TODO: Custom Validation design elements
        //     //TODO: Alert box for success
        //     //TODO: Alert box for error
        //     await updateUserData('/employees', newDataObj, dataObj.employees.length)
        //     history.back();
        //     return false;
        // }
    })

    document.addEventListener("click", (event) => {
        hideDropdownIfNotTarget(skillsFormEntryList, skillsFormEntryBtn, event);
    })

}
else {
    console.error("Error occurred.");
}

