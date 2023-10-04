import { tableData } from "./elements.js";
import { readUserData } from "./firebase.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { displayLoading, hideLoading, titleCase } from "./helperFunctions.js";


displayLoading();

onValue(readUserData, (snapshot) => {
    hideLoading();
    const data = snapshot.val();
    const employees = data.employees;
    let temp = ""

    for (let i = 0; i < employees.length; i++) {
        let employee = employees[i];
        let empName = titleCase(employee.first_name, employee.last_name);

        let skillSet = employee.skills;
        let skills = ""
        for (let j = 0; j < skillSet.length; j++) {
            let skill = skillSet[j]
            skills += `<span class="skill-card"><a href="#" class="skill"> ${skill.name} </a></span>`
        }


        temp +=
            `<tr class="table-row " >
        <td class="employee-data">${employee.id}</td>
        <td class="employee-data">${empName}</td>
        <td class="employee-data">${employee.designation}</td>
        <td class="employee-data">${employee.department}</td>
        <td class="employee-data"><div class="skill-list"> ${skills} </div></td>
        <td class="employee-data"><div class=" actions-list common-flex"> <span class="material-symbols-outlined">
        visibility
        </span> <span class="material-symbols-outlined">
        edit
        </span> <span class="material-symbols-outlined">
        delete
        </span> </div></td> </tr>`;
    }

    tableData.innerHTML += temp
});

