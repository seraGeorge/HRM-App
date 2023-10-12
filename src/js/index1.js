import { skillsFormEntryBtn, skillsFormEntryList, skillsFormEntrySelectedList } from "./elements.js";
import { toggleBtn } from "./handlers.js";
import { setDropDown } from "./setFilterDropdownData.js";

export const form = document.querySelector("#form")
export const genderOtherVal = document.querySelector("#gender-other-entry");
export const otherEntryField = document.querySelector("#gender-other-val");
export const submitBtn = document.querySelector("#submit-btn")
export const genderSelectedValue = document.querySelector('input[name="gender"]:checked');
// export const skills = document.querySelectorAll("")



const dataStr = localStorage['dataToPass'];
let dataObj;



if (dataStr !== undefined) {
    dataObj = JSON.parse(dataStr)
    console.log(dataObj)
    // localStorage.removeItem('dataToPass'); // Clear the localStorage
    toggleBtn(skillsFormEntryBtn, skillsFormEntryList)
    const skillsDataList = dataObj.skills.map((e) => e.name)

    setDropDown(skillsDataList, skillsFormEntryList, skillsFormEntrySelectedList, "skills")

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
        console.log(formDataObj);

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

        newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender-other-val : formDataObj.gender;

        console.log(newDataObj)

    })
}
else {
    console.error("Error occurred.");
}