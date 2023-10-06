import { readUserData } from "./firebase.js";

export const getDataFromJson = (url) => fetch(url)
    .then(response => {
        if (response.ok) {
            console.log(response)
            return response.json()
        }
        throw new Error('Something went wrong');
    })
    .then((data) => data)
    .catch((error) => {
        console.error(error)
    });
export const titleCase = (first, last) => {
    return first[0].toUpperCase() + first.substring(1) + " " + last[0].toUpperCase() + last.substring(1)

}
export const getYear = () => {
    const now = new Date();
    return now.getFullYear().toString()
}

export const sortCriteria = (index) => {
    return ["id", "emp_name", "designation", "department"][index]
}

export const sortFn = (x, y, flag) => {
    if (x > y) {
        return flag;
    }
    if (y > x) {
        return (-1 * flag);
    }
    return 0;
}