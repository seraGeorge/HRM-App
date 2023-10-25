//Converting to data
export const getDataFromJson = (url) => fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error('Something went wrong');
    })
    .then((data) => data)
    .catch((error) => {
        console.error(error)
    });
//Function to get the current Year
export const getYear = () => {
    const now = new Date();
    return now.getFullYear().toString()
}
//Function to find the key value for the sort criteria
export const sortCriteria = (index) => {
    return ["id", "emp_name", "designation", "department"][index]
}
//Function to sort in asc/desc depending on flag
export const sortFn = (x, y, flag) => {
    if (x > y) {
        return flag;
    }
    if (y > x) {
        return (-1 * flag);
    }
    return 0;
}
//Function to find the validity of the dateString
export const isValidDateFormat = (dateString) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    return dateRegex.test(dateString);
}
//Function to find the current dateString
export const getDate = (dateVal) => {
    const dateParts = dateVal.split("-");
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    date.setDate(date.getDate() + 1); // Adding one day to correct the date
    return date.toISOString().slice(0, 10);
}
//Function to check if there is a change in skills while editing the form
export const hasSkillArrayChanged = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const idSet1 = new Set(arr1.map(obj => obj.id));
    const idSet2 = new Set(arr2.map(obj => obj.id));

    return [...idSet1].every(id => idSet2.has(id));
}