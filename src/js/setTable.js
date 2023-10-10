import { state } from "./context.js";
import { tableBody } from "./elements.js";
import { filterData, getSearchedData } from "./handlers.js";
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
            <td class="employee-data">${employee.id}</td>
            <td class="employee-data">${employee.emp_name}</td>
            <td class="employee-data">${employee.designation}</td>
            <td class="employee-data">${employee.department}</td>
            <td class="employee-data"><div class="skill-list"> ${skills} </div></td>
            <td class="employee-data"><div class=" actions-list common-flex"> <span class="material-symbols-outlined">
            visibility
            </span> <span class="material-symbols-outlined">
            edit
            </span> <span class="material-symbols-outlined delete">
            delete
            </span> </div></td> `;
            tableRow.classList = "table-row";
            // tableRow.querySelector('.delete')
            tableBody.appendChild(tableRow);

        })
    }
}