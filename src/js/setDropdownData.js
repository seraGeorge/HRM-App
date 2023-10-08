import { departmentDropDownBtn, departmentOptionsList, departmentResetBtn, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, skillsDropDownBtn, skillsOptionsList, skillsResetBtn, skillsSelectedList } from "./elements.js";

export const setDropDownData = (data) => {
    console.log(data)

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
        setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skill");
        
    })
    document.addEventListener("click", (event) => {
        event.stopPropagation()
        if (!(filterBtn === event.target) && !(mainFilterDropDown.contains(event.target))) {
            if (mainFilterDropDown.classList.contains("display")) {
                mainFilterDropDown.classList.remove("display")
                console.log("hi")
                resetFilter(designationSelectedList, designationOptionsList);
                setDropDown(designationsDataList, designationOptionsList, designationSelectedList, "designation");
                resetFilter(departmentSelectedList, departmentOptionsList);
                setDropDown(departmentsDataList, departmentOptionsList, departmentSelectedList, "department");
                resetFilter(skillsSelectedList, skillsOptionsList);
                setDropDown(skillsDataList, skillsOptionsList, skillsSelectedList, "skill");
            }

        }

        if (!designationOptionsList.contains(event.target) && !(designationDropDownBtn === event.target) && (mainFilterDropDown.contains(event.target))) {
            if (designationOptionsList.classList.contains("display")) {
                designationOptionsList.classList.remove("display")
            }

        }
        if (!departmentOptionsList.contains(event.target) && !(departmentDropDownBtn === event.target) && (mainFilterDropDown.contains(event.target))) {
            if (departmentOptionsList.classList.contains("display")) {
                departmentOptionsList.classList.remove("display")
            }

        }
        if (!skillsOptionsList.contains(event.target) && !(skillsDropDownBtn === event.target) && (mainFilterDropDown.contains(event.target))) {
            if (skillsOptionsList.classList.contains("display")) {
                skillsOptionsList.classList.remove("display")
            }

        }

    })

}
export const setDropDown = (dataList, optionsList, selectedlist, className) => {
    console.log(dataList)
    optionsList.innerHTML = "";
    console.log(dataList)
    dataList.forEach((item) => {
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

        const listItemChip = document.createElement("div");
        listItemChip.classList.add("common-flex")
        listItemChip.classList.add("filter-chip")
        listItemChip.classList.add(listItemClass)
        listItemChip.innerHTML =
            `<h3 class="heading3">${listItem.innerHTML}</h3><button class="button material-symbols-outlined cancel-btn" id="cancel-btn">cancel</button>`
        selectedlist.appendChild(listItemChip)
        optionsList.removeChild(listItem)
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
