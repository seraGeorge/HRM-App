import { getDataFromJson } from "./helperFunctions.js";
import { writeUserData } from "./firebase.js";

const result = getDataFromJson('../data/data.json');

result.then(data => {
    writeUserData('/employees', data["employees"]);
    writeUserData('/skills', data["skills"])
    writeUserData('/designations', data["designations"])
    writeUserData('/departments', data["departments"])
    writeUserData('/employment_modes', data["employment_modes"])
}).catch((error) => {
    console.error(error)
});
