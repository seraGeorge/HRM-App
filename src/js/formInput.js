import { getSelectedSkills } from "./handlers.js";

//fetching new employeee details
export const getNewEmployeeDetails = (formDataObj, skills) => {
    let newDataObj = {}
    let { name, email, phone, address, date_of_birth, date_of_joining, designation, department, employment_mode } = formDataObj;
    newDataObj = { emp_name: name, email, phone, address, date_of_birth, date_of_joining, designation, department, employment_mode };
    newDataObj.gender = formDataObj.gender === "Other" ? formDataObj.gender_other_val : formDataObj.gender;
    newDataObj.skills = getSelectedSkills(skills);
    return newDataObj;
}
export const getNewEmpId = (employees) => {
    let largestId = null;
    for (const employee of employees) {
        if (employee != null) {
            const idNumber = parseInt(employee.id.substring(3));
            if (largestId === null || idNumber > parseInt(largestId.substring(3))) {
                largestId = employee.id;
            }
        }
    }
    const newEmpId = parseInt(largestId.substring(3)) + 1;
    const newEmpIdStr = (newEmpId).toString().length <= 2 ?
        "0".concat((newEmpId).toString())
        : (newEmpId).toString();
    return largestId.substring(0, 3).concat(newEmpIdStr)

}