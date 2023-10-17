import { state } from "./context.js";
import {  departmentOptionsList, departmentResetBtn, departmentSelectedList, designationOptionsList, designationResetBtn, designationSelectedList,  mainFilterDropDown, resetAllBtn,  skillsOptionsList, skillsResetBtn, skillsSelectedList } from "./elements.js";
import { setTableData } from "./setTable.js";

export const setFilterDropdownData = (data) => {

    const departmentsDataList = data.departments;
    const designationsDataList = data.designations;
    const skillsDataList = data.skills.map((e) => e.name)
    setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter")
    setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter")
    setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter")

    designationResetBtn.addEventListener("click", () => {
        resetFilter(designationSelectedList, designationOptionsList)
        setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter")
    })
    departmentResetBtn.addEventListener("click", () => {
        resetFilter(departmentSelectedList, departmentOptionsList)
        setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter")
    })
    skillsResetBtn.addEventListener("click", () => {
        resetFilter(skillsSelectedList, skillsOptionsList)
        setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter")
    })
    resetAllBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        resetFilter(designationSelectedList, designationOptionsList);
        setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter");
        resetFilter(departmentSelectedList, departmentOptionsList);
        setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter");
        resetFilter(skillsSelectedList, skillsOptionsList);
        setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter");
        if (!mainFilterDropDown.classList.contains("no-display")) {
            mainFilterDropDown.classList.add("no-display")
        }
        state.filter.designationFilters = [];
        state.filter.departmentFilters = [];
        state.filter.skillsFilters = [];

        setTableData(data.employees)
    })
}
export const setDropDown = (dataList, optionsList, selectedlist, className) => {
    optionsList.innerHTML = "";
    dataList.forEach((item) => {
        //List Item in the dropdown
        const listItem = createListItem(item);
        optionsList.appendChild(listItem)

        listItem.addEventListener("click", (event) => {
            event.stopPropagation();

            addSelection(item, listItem, selectedlist, optionsList, className)
        });
    })
}
export const addSelection = (item, listItem, selectedlist, optionsList, className) => {
    optionsList.classList.add("no-display")
    const listItemClass = className;

    //List Item Chip in the selectedList
    const listItemChip = createChip(item, listItemClass);

    selectedlist.appendChild(listItemChip)
    optionsList.removeChild(listItem)

    if (!optionsList.classList.contains("no-display")) {
        optionsList.classList.add("no-display");
    }


    // Create a custom event for changes in selectedlist
    const selectionChangeEvent = new CustomEvent("selectionChange", {
    });

    // Dispatch the custom event
    selectedlist.dispatchEvent(selectionChangeEvent);




    //Cancel Button interaction
    const chipCancelBtn = listItemChip.querySelector("#chip-cancel-btn")
    chipCancelBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        selectedlist.removeChild(listItemChip)
        optionsList.appendChild(listItem)



        // Create a custom event for changes in selectedlist
        const removalEvent = new CustomEvent("selectionChange", {
        });

        // Dispatch the custom event
        selectedlist.dispatchEvent(removalEvent);

    });

}
const createChip = (text, className) => {
    const listItemChip = document.createElement("div");
    listItemChip.classList.add("common-flex");
    listItemChip.classList.add("chip");
    listItemChip.classList.add(className);
    listItemChip.innerHTML = `
      <h3 class="chip-heading">${text}</h3>
      <button class="button material-symbols-outlined chip-cancel-btn" id="chip-cancel-btn">cancel</button>
    `;
    return listItemChip;
};
export const createListItem = (text) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = text;
    listItem.classList.add('list-item');
    return listItem;
};
export const resetFilter = (selectedlist, optionsList) => {
    selectedlist.innerHTML = "";
    optionsList.innerHTML = "";
}