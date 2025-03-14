// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAW5ynSCi5XlZ3eK_jeOOY0N32F75qy4XI",
    authDomain: "plataformacarros-1aa38.firebaseapp.com",
    projectId: "plataformacarros-1aa38",
    storageBucket: "plataformacarros-1aa38.firebasestorage.app",
    messagingSenderId: "1036522698900",
    appId: "1:1036522698900:web:53637f132ca9b7c78cdc81",
    measurementId: "G-G1NR1699J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }