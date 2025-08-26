// Import the functions you need from the SDKs you need
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "your-api-key-here",
  authDomain: "lodziarnia-u-dziekana.firebaseapp.com",
  projectId: "lodziarnia-u-dziekana",
  storageBucket: "lodziarnia-u-dziekana.firebasestorage.app",
  messagingSenderId: "84611145297",
  appId: "1:84611145297:web:f4e39ad5ff1f226fe3e270",
  databaseURL: "https://lodziarnia-u-dziekana-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
export { app, database };
