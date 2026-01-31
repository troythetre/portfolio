// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCaGgYcfhCb7nQvTKdMN8Z3wosetg7Hr0",
  authDomain: "voop-68258.firebaseapp.com",
  projectId: "voop-68258",
  storageBucket: "voop-68258.appspot.com",
  messagingSenderId: "98474867529",
  appId: "1:98474867529:web:889c466f688d80a1273898",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//connectFirestoreEmulator(db, "localhost", 8080);
export const auth = getAuth(app);
//connectAuthEmulator(auth, "http://localhost:9099");
export const storage = getStorage(app);
//connectStorageEmulator(storage, "localhost", 9199);
export const functions = getFunctions(app);
//connectFunctionsEmulator(functions, "localhost", 9000);
