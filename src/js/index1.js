import { skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList } from "./elements.js";
import { writeUserData } from "./firebase.js";
import { setOptionsList, toggleBtn } from "./handlers.js";
import { setDropDown } from "./setFilterDropdownData.js";
import { setTableData } from "./setTable.js";

export const form = document.querySelector("#form")
export const genderOtherVal = document.querySelector(".gender-other-entry");
export const otherEntryField = document.querySelector("#gender-other-val");
export const submitBtn = document.querySelector("#submit-btn")
export const genderSelectedValue = document.querySelector('input[name="gender"]:checked');
export const skills = document.querySelectorAll("#skills-select .chip-heading")
export const designationSelectEntry = document.querySelector("#designation-entry")
export const departmentSelectEntry = document.querySelector("#department-entry")
export const empModeSelectEntry = document.querySelector("#empmode-entry")


const dataStr = localStorage['dataToPass'];
let dataObj;



if (dataStr !== undefined) {
    dataObj = JSON.parse(dataStr)
    console.log(dataObj)

    //dropdown data setting
    const designationsDataList = dataObj.designations;
    const departmentsDataList = dataObj.departments;
    const empModeDataList = dataObj.employment_modes;
    setOptionsList(designationsDataList,designationSelectEntry)
    setOptionsList(departmentsDataList,departmentSelectEntry)
    setOptionsList(empModeDataList,empModeSelectEntry)

    //Skill custom dropdown
    const skillsDataList = dataObj.skills.map((e) => e.name)
    toggleBtn(skillsFormEntryBtn, skillsFormEntryList)
    setDropDown(skillsDataList, skillsFormEntryList, skillsFormEntrySelectedList, "skills-select")

    //Other Entry
    genderOtherVal.addEventListener("click", () => {
        otherEntryField.classList.remove("no-display")
    })

    //Form submission
    let formDataObj = {};
    let newDataObj = {};

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        //Get form data
        const formData = new FormData(form);
        formData.forEach((value, key) => (formDataObj[key] = value));

        //Set new Data
        newDataObj.emp_name = formDataObj.fname.concat(" ", formDataObj.lname);
        newDataObj.email = formDataObj.email;
        newDataObj.phone = formDataObj.phone;
        newDataObj.address = formDataObj.address;
        newDataObj.date_of_birth = formDataObj.date_of_birth;
        newDataObj.date_of_joining = formDataObj.date_of_joining;
        newDataObj.designation = formDataObj.designation;
        newDataObj.department = formDataObj.department;
        newDataObj.employment_mode = formDataObj.emp_mode;

        newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender - other - val : formDataObj.gender;
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
        console.log("0".concat((parseInt(largestId.substring(3)) + 1).toString()))
        const empIdNumericalPart = (parseInt(largestId.substring(3)) + 1).toString().length <= 2 ?
            "0".concat((parseInt(largestId.substring(3)) + 1).toString())
            : (parseInt(largestId.substring(3)) + 1).toString();
        newDataObj.id = largestId.substring(0, 3).concat(empIdNumericalPart)
        console.log(newDataObj)
        dataObj.employees.push(newDataObj)
        console.log(dataObj.employees)

        writeUserData('/employees', dataObj.employees);

        // history.back();
        // localStorage.removeItem('dataToPass'); // Clear the localStorage
        // return false;      
    })

}
else {
    console.error("Error occurred.");
}

