// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmGdXqgozWts5Ss9raY0BjMrWJmFeDCIc",
    authDomain: "inventory-ebf94.firebaseapp.com",
    projectId: "inventory-ebf94",
    storageBucket: "inventory-ebf94.appspot.com",
    messagingSenderId: "1046192275362",
    appId: "1:1046192275362:web:721a724f6a8a5737adbcfb",
    measurementId: "G-Z3FVG5WFH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }