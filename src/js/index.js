import { applyAllBtn, departmentDropDownBtn, departmentOptionsList, departmentSelectedList, designationDropDownBtn, designationOptionsList, designationResetBtn, designationSelectedList, filterBtn, mainFilterDropDown, resetAllBtn, searchDropDown, searchDropDownBtn, searchDropDownBtnText, searchFilterList, searchText, skillsDropDownBtn, skillsOptionsList, skillsSelectedList, sortBtnList, sortIcon } from "./elements.js";
import { readUserData } from "./firebase.js";
import { applyFilter, displayLoading, filterData, hideLoading, toggleBtn } from "./handlers.js";
import { sortCriteria } from "./helperFunctions.js";
import { resetFilter, setDropDown, setDropDownData } from "./setDropDownData.js";
import { setTableData } from "./setTable.js";
import { sortBtnHandler } from "./sortFn.js";


//Loader before the table Data
displayLoading();

let dataVal;
let sortedData;


async function fetchData() {
    let sortedData;

    try {
        const data = await readUserData(`/`);
        // Hiding loader
        hideLoading();
        sortedData = sortBtnHandler(data.employees, 0, sortCriteria(0));
        // Copy of the data from firebase
        dataVal = data;
    } catch (error) {
        console.error(error);
        return null;
    }

    return sortedData;
}
fetchData()
    .then((employeeList) => {
        if (employeeList !== null) {
            setTableData(employeeList)
            setDropDownData(dataVal)

            sortBtnList.forEach((sortBtn, index) =>
                sortBtn.addEventListener("click", () => {
                    sortedData = sortBtnHandler(dataVal.employees, index, sortCriteria(index));
                    setTableData(sortedData)
                }))


            toggleBtn(filterBtn, mainFilterDropDown)
            toggleBtn(designationDropDownBtn, designationOptionsList)
            toggleBtn(departmentDropDownBtn, departmentOptionsList)
            toggleBtn(skillsDropDownBtn, skillsOptionsList)
            toggleBtn(searchDropDownBtn, searchDropDown)




            applyAllBtn.addEventListener("click", () => {
                mainFilterDropDown.classList.remove("display");
                let tableData = applyFilter(employeeList);
                setTableData(tableData);

            });

            searchFilterList.forEach((searchFilter) => {
                const labelElement = document.querySelector(`label[for="${searchFilter.id}"]`);

                if (searchFilter.checked) {
                    searchDropDownBtnText.innerHTML = labelElement.textContent
                }
                searchFilter.addEventListener("click", () => {
                    searchDropDown.classList.remove("display")
                    searchDropDownBtnText.innerHTML = labelElement.textContent
                })
            })
            searchText.addEventListener("input", () => {
                let tableData = []
                if (searchText != "") {
                    employeeList.forEach((employee) => {
                        console.log(searchDropDownBtnText.innerHTML.toLowerCase())
                        if (searchDropDownBtnText.innerHTML.toLowerCase() == "all") {
                            console.log("hi")
                            const designationMatch = (employee["designation"].toLowerCase()).indexOf(searchText.value.toLowerCase()) >= 0
                            const departmentMatch = (employee["department"].toLowerCase()).indexOf(searchText.value.toLowerCase()) >= 0
                            const skillsMatch = employee["skills"].some((skill) => (skill.name.toLowerCase()).indexOf(searchText.value.toLowerCase()) >= 0)

                            if (skillsMatch || departmentMatch || designationMatch) {
                                tableData.push(employee)
                            }
                        }
                        else {
                            if (searchDropDownBtnText.innerHTML.toLowerCase() == "skills") {
                                let propertyValue = employee[searchDropDownBtnText.innerHTML.toLowerCase()];
                                if (propertyValue.some((skill) => (skill.name.toLowerCase()).indexOf(searchText.value.toLowerCase()) >= 0)) {
                                    tableData.push(employee)
                                }

                            }
                            else {
                                let propertyValue = employee[searchDropDownBtnText.innerHTML.toLowerCase()];
                                if ((propertyValue.toLowerCase()).indexOf(searchText.value.toLowerCase()) >= 0) {
                                    tableData.push(employee)
                                }
                            }
                        }
                    })
                    console.log(tableData)
                }
                else {
                    tableData = employeeList
                }
                setTableData(tableData)
            })
            document.addEventListener("click", (event) => {
                event.stopPropagation()
                if (!(searchDropDownBtn === event.target) && (!(searchDropDownBtn.contains(event.target))) && !(searchDropDown.contains(event.target))) {
                    if (searchDropDown.classList.contains("display")) {
                        searchDropDown.classList.remove("display")
                    }
                }
            });

        } else {
            console.error("Error occurred.");
        }
    });

