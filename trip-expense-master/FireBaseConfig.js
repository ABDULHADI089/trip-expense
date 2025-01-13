// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1L9yoH6O5OiF9aLRlRGfONesF9wz4lb8",
  authDomain: "trip-expense-fb0e7.firebaseapp.com",
  projectId: "trip-expense-fb0e7",
  storageBucket: "trip-expense-fb0e7.appspot.com",
  messagingSenderId: "642023862583",
  appId: "1:642023862583:web:33685f5759a6f8d5d2eab2",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
