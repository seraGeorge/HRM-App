import { tableData } from "./elements.js";
import { readUserData } from "./firebase.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { displayLoading, hideLoading, titleCase } from "./helperFunctions.js";
displayLoading()

onValue(readUserData, (snapshot) => {
    hideLoading();
    const data = snapshot.val();
    console.log(data)
    const employees = data.employees;
    let temp = ""
    if (employees.length == 0) {
        temp = `<tr class="table-row">         
        <td class="employee-data no-entry-table" >No entry</td>
        </tr > `
    }
    else {
        for (let i = 0; i < employees.length; i++) {
            let element = employees[i];
            const empName = titleCase(element.first_name, element.last_name);

            let skillSet = element.skills;
            let skills = ""
            for (let j = 0; j < skillSet.length; j++) {
                let skill = skillSet[j]
                skills += `<div class="skill-card"><a href="#" class="skill"> ${skill.name} </a></div>`
            }


            temp +=
                `<tr class="table-row " >
        <td class="employee-data">${element.id}</td>
        <td class="employee-data">${empName}</td>
        <td class="employee-data">${element.designation}</td>
        <td class="employee-data">${element.department}</td>
        <td class="employee-data"><div class="skill-list"> ${skills} </div></td>
        <td class="employee-data"><div class=" actions-list common-flex"> <span class="material-symbols-outlined">
        visibility
        </span> <span class="material-symbols-outlined">
        edit
        </span> <span class="material-symbols-outlined">
        delete
        </span> </div></td> </tr>`;
        }
    }
    tableData.innerHTML += temp
});

