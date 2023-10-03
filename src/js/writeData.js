import { getData } from "./helperFunctions.js";
import { writeUserData } from "./firebase.js";

const result = getData('../data/data.json');

result.then(data => {
    writeUserData('/employees', data["employees"]);
    writeUserData('/skills', data["skills"])
    writeUserData('/designations', data["designations"])
    writeUserData('/departments', data["departments"])
});
