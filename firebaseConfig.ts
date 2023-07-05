// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYERqi-m2emZ7w-CT0TY0btccoPE1IvL8",
  authDomain: "botope-e9631.firebaseapp.com",
  projectId: "botope-e9631",
  storageBucket: "botope-e9631.appspot.com",
  messagingSenderId: "459028477143",
  appId: "1:459028477143:web:5ad58f26c6acb3c910ac92",
  measurementId: "G-1MC4B76E71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
