const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyArivSFwrbwSU-U_o50gTMPGaWtcurvWHg",
  authDomain: "lodziarnia-u-dziekana.firebaseapp.com",
  projectId: "lodziarnia-u-dziekana",
  storageBucket: "lodziarnia-u-dziekana.appspot.com",
  messagingSenderId: "84611145297",
  appId: "1:84611145297:web:f4e39ad5ff1f226fe3e270",
  databaseURL: "https://lodziarnia-u-dziekana-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

module.exports = { app };