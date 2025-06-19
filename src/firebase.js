// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAwhNgsuU53S4CbJ9CUeDnF27Qik3eOepI",
    authDomain: "ossprojectregister.firebaseapp.com",
    projectId: "ossprojectregister",
    storageBucket: "ossprojectregister.firebasestorage.app",
    messagingSenderId: "437004344533",
    appId: "1:437004344533:web:c0b8d24b3e82583530565c"
  };

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
