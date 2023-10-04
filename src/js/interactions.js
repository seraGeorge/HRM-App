import { sortButtonsList, sortIconsList, year } from "./elements.js";
import { getYear } from "./helperFunctions.js";

year.innerHTML = getYear()

// console.log(sortButtonsList)
console.log(sortIconsList)
function buttonClickHandler(event) {
    // Your code to handle the button click goes here
    console.log('Button clicked!', event.target);
}

sortButtonsList.forEach((sortBtn) => {
    sortBtn.addEventListener("click",buttonClickHandler)
})


