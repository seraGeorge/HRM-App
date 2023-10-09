import { loader, sortIcon, tableData, year } from "./elements.js";
import { getYear } from "./helperFunctions.js";

year.innerHTML = getYear()
export const displayLoading = () => {
    loader.classList.add("display");
    tableData.style.display = "none"
}

export const hideLoading = () => {
    loader.classList.remove("display");
    tableData.style.display = "table"

}


export const makeSortIconVisible = (index) => {
    sortIcon.forEach((item, id) => {
        if (id != index) {
            sortIcon[id].style.visibility = "hidden"
        }
        else {
            sortIcon[index].style.visibility = "visible"
        }
    })

}

export const toggleBtn = (button, dropdown) => {
    button.addEventListener("click", () => {
        dropdown.classList.toggle("display")
    })

}

export const filterData = (result, designationFilters, departmentFilters, skillsFilters) => {
    let tableData;
    if (skillsFilters.length != 0 || departmentFilters.length != 0 || designationFilters.length != 0) {
        tableData = result.filter((e) => {
            const designationMatch = designationFilters.length != 0 ? designationFilters.includes(e.designation) : true;
            const departmentMatch = departmentFilters.length != 0 ? departmentFilters.includes(e.department) : true;
            const skillMatch = skillsFilters.length != 0 ? e.skills.some((f) => skillsFilters.includes(f.name)) : true;
            // Include the employee in the filtered array if any of the conditions are true
            return designationMatch && departmentMatch && skillMatch;
        });
    } else {
        tableData = result;
    }
    return tableData
}

export const applyFilter = (result) => {
    const designationFilterChips = document.querySelectorAll(".designation-filter ");
    const departmentFilterChips = document.querySelectorAll(".department-filter ");
    const skillsFilterChips = document.querySelectorAll(".skills-filter ");

    const designationFilters = [];
    const departmentFilters = [];
    const skillsFilters = [];

    designationFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        designationFilters.push(filterChipValue.innerHTML);
    });
    departmentFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        departmentFilters.push(filterChipValue.innerHTML);
    });
    skillsFilterChips.forEach((filterChip) => {
        const filterChipValue = filterChip.querySelector(".heading3");
        skillsFilters.push(filterChipValue.innerHTML);
    });

    let tableData = filterData(result, designationFilters, departmentFilters, skillsFilters);
    return tableData;
}