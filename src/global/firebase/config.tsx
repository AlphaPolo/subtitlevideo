// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
// import React from "react";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApd1eYTd7izCSkqca6YrzT2-oqibnSH6k",
  authDomain: "subtitlevideo.firebaseapp.com",
  projectId: "subtitlevideo",
  storageBucket: "subtitlevideo.appspot.com",
  messagingSenderId: "521088007957",
  appId: "1:521088007957:web:90c78043927ded57c1f31c"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

export default firebaseConfig;