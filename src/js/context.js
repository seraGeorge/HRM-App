export const state = {
    sort: 0,
    filter: {
        designationFilters: [],
        departmentFilters: [],
        skillsFilters: []
    },
    search: {
        searchTerm: "",
        property: "all"
    },
    form: {
        isInputValid: false,
        isSkillsValid: false,
        errorMsg:"",
    }
}