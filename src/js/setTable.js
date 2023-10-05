import { tableBody } from "./elements.js";
import { titleCase } from "./helperFunctions.js";

export const setTableData = (data) => {
        const employees = data.employees;

        for (let i = 0; i < employees.length; i++) {
            let employee = employees[i];
            let empName = titleCase(employee.first_name, employee.last_name);

            let skillSet = employee.skills;
            let skills = ""
            for (let j = 0; j < skillSet.length; j++) {
                let skill = skillSet[j]
                skills += `<span class="skill-card"><a href="#" class="skill"> ${skill.name} </a></span>`
            }

            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <td class="employee-data">${employee.id}</td>
            <td class="employee-data">${empName}</td>
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
            tableRow.querySelector('.delete')
            tableBody.appendChild(tableRow);
        }

}