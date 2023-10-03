// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVZhWv22v1m2AK1UzUQjuQnmqYky4_lS0",
    authDomain: "human-resources-manageme-3813a.firebaseapp.com",
    databaseURL: "https://human-resources-manageme-3813a-default-rtdb.firebaseio.com",
    projectId: "human-resources-manageme-3813a",
    storageBucket: "human-resources-manageme-3813a.appspot.com",
    messagingSenderId: "735154071095",
    appId: "1:735154071095:web:f484e282e8bce45f3581b2",
    measurementId: "G-R68Z2LFJGQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

//Writing data into your Realtime Database
export function writeUserData(path,data) {
    set(ref(database, path), data);
}

//Reading data into your Realtime Database
export const readUserData = ref(database, '/');
