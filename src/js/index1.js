import { pageTitle, skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList } from "./elements.js";
import { updateUserData, writeUserData } from "./firebase.js";
import { hideDropdownIfNotTarget, setOptionsList, toggleBtn } from "./handlers.js";
import { setDropDown } from "./setFilterDropdownData.js";
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

if (source === "edit") {
    if (dataStr !== undefined) {

        pageTitle.innerHTML = "Update Details of a employee"
        submitBtn.innerHTML = "Save"

        const dataObj = JSON.parse(dataStr);
        const empIdToEdit = localStorage["empId"]
        const empToEdit = dataObj.employees.find((employee) => employee.id === empIdToEdit);
        console.log(empToEdit.emp_name)

    }
    else {
        console.error("Error occurred.");
    }
}
else if (source === "add") {
    if (dataStr !== undefined) {

        pageTitle.innerHTML = "Add New employee"

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

        //Form submission
        let formDataObj = {};
        let newDataObj = {};
        console.log(dataObj.employees)
        submitBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            //Get form data
            const formData = new FormData(form);
            formData.forEach((value, key) => (formDataObj[key] = value));
            console.log(formDataObj)

            //Set new Data
            newDataObj.emp_name = formDataObj.fname.concat(" ", formDataObj.lname);
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
        })

        document.addEventListener("click", (event) => {
            hideDropdownIfNotTarget(skillsFormEntryList, skillsFormEntryBtn, event);
        })
    }
    else {
        console.error("Error occurred.");
    }
}


