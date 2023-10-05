import { loader, tableData } from "./elements.js";

export const getData = (url) => fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error('Something went wrong');
    })
    .then((data) => data)
    .catch((error) => {
        console.log(error)
    });
export const titleCase = (first, last) => {
    return first[0].toUpperCase() + first.substring(1) + " " + last[0].toUpperCase() + last.substring(1)

}
export function getYear() {
    const now = new Date();
    return now.getFullYear().toString()
}

export const displayLoading = () => {
    loader.classList.add("display");
    tableData.style.display = "none"
}

export const hideLoading = () => {
    loader.classList.remove("display");
    tableData.style.display = "table"

}
