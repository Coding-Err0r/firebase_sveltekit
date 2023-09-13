import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from "svelte/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABDzvRTstAPj1rzOnrd_0xhIbr4iy8TKw",
  authDomain: "myapp-3df3c.firebaseapp.com",
  projectId: "myapp-3df3c",
  storageBucket: "myapp-3df3c.appspot.com",
  messagingSenderId: "382951495506",
  appId: "1:382951495506:web:7d175f2ae5950f41644c8b",
  measurementId: "G-PMHFQRWPR0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();


