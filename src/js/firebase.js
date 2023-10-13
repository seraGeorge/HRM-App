// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, get, child, ref, set, onValue, push, update,remove} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { displayLoading, hideLoading } from "./handlers.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmgesvRfGfX4MF5r4xcTPhNo1sgY3l27U",
    authDomain: "human-resources-manageme-367c7.firebaseapp.com",
    databaseURL: "https://human-resources-manageme-367c7-default-rtdb.firebaseio.com",
    projectId: "human-resources-manageme-367c7",
    storageBucket: "human-resources-manageme-367c7.appspot.com",
    messagingSenderId: "40040684447",
    appId: "1:40040684447:web:5ea1a2a1f6393ad689bbaa",
    measurementId: "G-D95JZCKQ90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

//Writing data into your Realtime Database
export function writeUserData(path, data) {
    return set(ref(database, path), data)
}

//Reading data into your Realtime Database
export const readUserData = (url) => {
    const userRef = ref(database, url);

    return new Promise((resolve, reject) => {
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                resolve(data);
            } else {
                reject(new Error('No data available'));
            }
        }, (error) => {
            console.error(error);
            reject(error);
        });
    });
};

export const updateUserData = (url, data, index) => {
    const userRef = ref(database, url + "/" + index);
    return update(userRef, data)
}
export const deleteUserData = (url, index) => {
    const userRef = ref(database, url + "/" + index);
    return remove(userRef)
}