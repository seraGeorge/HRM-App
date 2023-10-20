import { state } from "./context.js";
import { departmentOptionsList, departmentResetBtn, departmentSelectedList, designationOptionsList, designationResetBtn, designationSelectedList, mainFilterDropDown, resetAllBtn, skillsOptionsList, skillsResetBtn, skillsSelectedList } from "./elements.js";
import { setTableData } from "./setTable.js";

//Setting data for the dropdown
export const setFilterDropdownData = (data) => {

    const departmentsDataList = data.departments;
    const designationsDataList = data.designations;
    const skillsDataList = data.skills.map((e) => e.name)
    setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter")
    setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter")
    setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter")

    designationResetBtn.addEventListener("click", () => {
        resetFilter(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter")
    })
    departmentResetBtn.addEventListener("click", () => {
        resetFilter(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter")
    })
    skillsResetBtn.addEventListener("click", () => {
        resetFilter(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter")
    })
    resetAllBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        resetFilter(designationsDataList, designationOptionsList, designationSelectedList, "designation-filter")
        resetFilter(departmentsDataList, departmentOptionsList, departmentSelectedList, "department-filter")
        resetFilter(skillsDataList, skillsOptionsList, skillsSelectedList, "skills-filter")
        state.filter.designationFilters = [];
        state.filter.departmentFilters = [];
        state.filter.skillsFilters = [];

        setTableData(data.employees)
    })
}
//Creating the dropdown
export const setDropDown = (dataList, optionsList, selectedlist, className) => {
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
//Create list items for the dropdown
export const createListItem = (text) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = text;
    listItem.classList.add('list-item');
    return listItem;
};
//Add chips on clicking the list item
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
//Create chips on selection
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
//Reset button action
export const resetFilter = (dataList, optionsList, selectedlist, className) => {
    selectedlist.innerHTML = "";
    optionsList.innerHTML = "";
    setDropDown(dataList, optionsList, selectedlist, className)
}
//Hide dropdown if it is not targetted
export const hideDropdownIfNotTarget = (dropdown, button, event) => {

    if (!(button.contains(event.target)) && !(dropdown.contains(event.target))) {
        if (!dropdown.classList.contains("no-display")) {
            dropdown.classList.add("no-display");
        }
    }
}