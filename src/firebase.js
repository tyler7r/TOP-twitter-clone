// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyIrlyKc9Gms20l0K9VCDhN3Dx6eS1pMM",
  authDomain: "top-twitter-clone.firebaseapp.com",
  projectId: "top-twitter-clone",
  storageBucket: "top-twitter-clone.appspot.com",
  messagingSenderId: "566245900900",

  appId: "1:566245900900:web:732ea0d1729118ebcd1571",
  measurementId: "G-W67FTMQYKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);