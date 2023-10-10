import { state } from "./context.js";
import { deleteModal, deleteModalCancelBtn, deleteModalCloseBtn, deleteModalConfirmBtn, tableBody } from "./elements.js";
import { writeUserData } from "./firebase.js";
import { displayLoading, filterData, getSearchedData, hideLoading, toggleBtn } from "./handlers.js";
import { sortBtnHandler } from "./sortFn.js";

export const setTableData = (employees) => {
    tableBody.innerHTML = "";
    let sortedEmployees = sortBtnHandler(employees, state.sort)
    let filteredEmployees = filterData(sortedEmployees, state.filter.designationFilters, state.filter.departmentFilters, state.filter.skillsFilters)
    let searchedEmployees = getSearchedData(filteredEmployees, state.search.property, state.search.searchTerm)


    if (searchedEmployees.length > 0) {
        searchedEmployees.forEach((employee) => {

            let skillSet = employee.skills;
            let skills = ""
            for (let j = 0; j < skillSet.length; j++) {
                let skill = skillSet[j]
                skills += `<span class="skill-card"><a href="#" class="skill"> ${skill.name} </a></span>`
            }

            const tableRow = document.createElement('tr');

            tableRow.innerHTML = `
            <td class="employee-data employee-id">${employee.id}</td>
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
        })
        employeeDeleteBtnAction(employees);
    }
}
const employeeDeleteBtnAction = (employeeList) => {
    toggleBtn(deleteModalCloseBtn, deleteModal);
    toggleBtn(deleteModalCancelBtn, deleteModal);
    toggleBtn(deleteModalConfirmBtn, deleteModal)

    const employeeDltBtnList = document.querySelectorAll(".employee-delete");
    employeeDltBtnList.forEach((employeeDltBtn, index) => {
        toggleBtn(employeeDltBtn, deleteModal);
        employeeDltBtn.addEventListener("click", () => {
            employeeDeleteConfirmAction(employeeList, index)
        })
    })

}
const employeeDeleteConfirmAction = (employeeList, index) => {
    const employeeIdNodeList = document.querySelectorAll(".employee-id")
    const employeeIdList = Array.from(employeeIdNodeList).map((e) => e.innerHTML)

    deleteModalConfirmBtn.addEventListener("click", () => {
        const newEmployeeList = employeeList.filter((employee) => employee.id != employeeIdList[index]);
        writeUserData('/employees', newEmployeeList);
    })
};
