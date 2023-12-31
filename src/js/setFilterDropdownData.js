import { state } from "./context.js";
import { departmentDropDownBtn, departmentOptionsList, departmentResetBtn, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, skillsDropDownBtn, skillsOptionsList, skillsResetBtn, skillsSelectedList } from "./elements.js";
import { setTableData } from "./setTable.js";

export const setFilterDropdownData = (data) => {

    const departmentsDataList = data.departments;
    const designationsDataList = data.designations;
    const skillsDataList = data.skills.map((e) => e.name)
    setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation")
    setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department")
    setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills")

    designationResetBtn.addEventListener("click", () => {
        resetFilter(designationSelectedList, designationOptionsList)
        setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation")
    })
    departmentResetBtn.addEventListener("click", () => {
        resetFilter(departmentSelectedList, departmentOptionsList)
        setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department")
    })
    skillsResetBtn.addEventListener("click", () => {
        resetFilter(skillsSelectedList, skillsOptionsList)
        setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills")
    })
    resetAllBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        resetFilter(designationSelectedList, designationOptionsList);
        setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation");
        resetFilter(departmentSelectedList, departmentOptionsList);
        setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department");
        resetFilter(skillsSelectedList, skillsOptionsList);
        setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skills");
        if (mainFilterDropDown.classList.contains("display")) {
            mainFilterDropDown.classList.remove("display")
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
        const listItem = document.createElement("li");
        listItem.innerHTML = item;
        listItem.classList.add('list-item')
        optionsList.appendChild(listItem)

        addSelection(listItem, selectedlist, optionsList, className)
    })
}
const addSelection = (listItem, selectedlist, optionsList, className) => {
    listItem.addEventListener("click", (event) => {

        optionsList.classList.remove("display")
        event.stopPropagation();
        const listItemClass = className + "-filter";

        //List Item Chip in the selectedList
        const listItemChip = document.createElement("div");
        listItemChip.classList.add("common-flex")
        listItemChip.classList.add("filter-chip")
        listItemChip.classList.add(listItemClass)
        listItemChip.innerHTML =
            `<h3 class="heading3">${listItem.innerHTML}</h3>
            <button class="button material-symbols-outlined cancel-btn" id="cancel-btn">cancel</button>`
        selectedlist.appendChild(listItemChip)
        optionsList.removeChild(listItem)

        //Cancel Button interaction
        const cancelBtn = listItemChip.querySelector("#cancel-btn")
        cancelBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            selectedlist.removeChild(listItemChip)
            optionsList.appendChild(listItem)
        })
    })
}

export const resetFilter = (selectedlist, optionsList) => {
    selectedlist.innerHTML = "";
    optionsList.innerHTML = "";
}
