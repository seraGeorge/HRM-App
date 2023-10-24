import { filterData, getSearchedData, sortBtnHandler } from "./actions.js";
import { state } from "./context.js";
import { hideDropdownIfNotTarget } from "./dropdown.js";
import { body, deleteModal, deleteModalCancelBtn, deleteModalCloseBtn, deleteModalConfirmBtn, empAddressVal, empDOBVal, empDOJVal, empDepartmentVal, empDesignationVal, empEmailVal, empGenderVal, empIdToDlt, empModeVal, empName, empPhoneNoVal, empSkillsList, empWorkExpVal, overlay, snackbar, tableBody, viewModal, viewModalCloseBtn } from "./elements.js";
import { writeUserData } from "./firebase.js";
import { displayLoading, formatDate, hideLoading, showSnackbar, toggleBtn, removeOverlay, addOverlay } from "./handlers.js";

export const setTableData = (employees) => {
    tableBody.innerHTML = "";
    let sortedEmployees = sortBtnHandler(employees, state.sort)
    let filteredEmployees = filterData(sortedEmployees, state.filter.designationFilters, state.filter.departmentFilters, state.filter.skillsFilters)
    let searchedEmployees = getSearchedData(filteredEmployees, state.search.property, state.search.searchTerm)
    if ((searchedEmployees === undefined) || (searchedEmployees.length === 0)) {
        const tableRow = document.createElement('tr');

        tableRow.innerHTML = `<td class="no-data" colspan="6">No data Available</td>`;
        tableRow.classList = "table-row";
        tableBody.appendChild(tableRow);

    }
    else {
        searchedEmployees.forEach((employee) => {

            let skillSet = employee.skills;
            let skills = ""
            for (let j = 0; j < skillSet.length; j++) {
                let skill = skillSet[j]
                skills += `<span class="skill-card"> ${skill.name} </span>`
            }

            const tableRow = document.createElement('tr');

            tableRow.innerHTML = `
            <td class="employee-data employee-id" data-id="${employee.id}">${employee.id}</td>
            <td class="employee-data">${employee.emp_name}</td>
            <td class="employee-data">${employee.designation}</td>
            <td class="employee-data">${employee.department}</td>
            <td class="employee-data"><div class="skill-list"> ${skills} </div></td>
            <td class="employee-data"><div class=" actions-list common-flex"> 
            <button class="button material-symbols-outlined employee-view" >visibility</button> 
            <button class="button material-symbols-outlined employee-edit">edit</button> 
            <button class="button material-symbols-outlined employee-delete">delete</button> 
            </div></td> `;
            tableRow.classList = "table-row";
            tableBody.appendChild(tableRow);
            const deleteSelector = tableRow.querySelector(".employee-delete");
            const viewSelector = tableRow.querySelector(".employee-view");
            const editSelector = tableRow.querySelector(".employee-edit");
            const employeeIdTag = tableRow.querySelector(".employee-id");
            const employeeIdVal = employeeIdTag.dataset.id;
            employeeDeleteBtnAction(employees, deleteSelector, employeeIdVal);
            employeeViewAction(employees, viewSelector, employeeIdVal);
            employeeEditAction(employees, editSelector, employeeIdVal)
        })
        toggleBtn(deleteModalCloseBtn, deleteModal, true);
        toggleBtn(deleteModalCancelBtn, deleteModal, true);
        toggleBtn(deleteModalConfirmBtn, deleteModal, true)
        toggleBtn(viewModalCloseBtn, viewModal, true);
    }

}
const employeeDeleteBtnAction = (employeeList, deleteSelector, employeeIdVal) => {
    deleteSelector.addEventListener("click", (event) => {
        addOverlay(deleteModal)
        event.stopPropagation(); // Prevent the click from reaching the document and closing the modal
        deleteModal.classList.remove("no-display");
        empIdToDlt.innerHTML = employeeIdVal;
        employeeDeleteConfirmAction(employeeIdVal, employeeList)
    })

}
const employeeDeleteConfirmAction = (employeeIdVal, employeeList) => {
    deleteModalConfirmBtn.addEventListener("click", () => {
        const newEmpList = employeeList.filter((employee) => employee.id !== employeeIdVal);

        if (newEmpList.length > -1) {
            writeUserData('/employees', newEmpList) // Passing null to delete the data at the specified index.
                .then(() => {
                    setTableData(newEmpList);
                    const snackbarTxt = employeeIdVal + " has been deleted"
                    showSnackbar("check_circle", "Success", snackbarTxt);
                })
                .catch((error) => {
                    console.error("Error updating user data:", error);
                });
        }
    })
};
const employeeViewAction = (employeeList, viewSelector, employeeIdVal) => {
    toggleBtn(viewSelector, viewModal)
    viewSelector.addEventListener("click", () => {
        addOverlay(viewModal)
        const indexToView = employeeList.findIndex((employee) => employee.id === employeeIdVal)
        const currentEmployee = employeeList[indexToView];

        const DOJ = new Date(currentEmployee.date_of_joining);
        const now = new Date();
        const workExp = Math.floor((now - DOJ) / (1000 * 60 * 60 * 24 * 30));
        //TODO:Work Experience
        empName.innerHTML = currentEmployee.emp_name ?? "-";
        empDesignationVal.innerHTML = currentEmployee.designation ?? "-";
        empDepartmentVal.innerHTML = currentEmployee.department ?? '-';
        empModeVal.innerHTML = currentEmployee.employment_mode ?? '-';
        empWorkExpVal.innerHTML = workExp.toString() + " months" ?? '-';
        empDOBVal.innerHTML = currentEmployee.date_of_birth ?? '-';
        empDOJVal.innerHTML = currentEmployee.date_of_joining ?? '-';
        empGenderVal.innerHTML = currentEmployee.gender ?? '-';
        empEmailVal.innerHTML = currentEmployee.email ?? '-';
        empPhoneNoVal.innerHTML = currentEmployee.phone ?? '-';
        empAddressVal.innerHTML = currentEmployee.address ?? '-';


        let temp = ""
        if (currentEmployee.skills.length > 0) {
            currentEmployee.skills.forEach((skill) => {
                temp += `<span class="skill-card"> ${skill.name} </span>`
            })
        }
        else {
            temp = '-'
        }
        empSkillsList.innerHTML = temp
    })
}
const employeeEditAction = (employees, editSelector, employeeIdVal) => {
    editSelector.addEventListener("click", () => {
        window.location.href = './src/pages/employeeDetails.html';
        localStorage.setItem('empId', employeeIdVal);
    })
}