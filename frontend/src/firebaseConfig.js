import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAi1o84P4rICuzvixlln_usAVOU8uiNu9M",

  authDomain: "chillum-phillum-auth.firebaseapp.com",

  projectId: "chillum-phillum-auth",

  storageBucket: "chillum-phillum-auth.firebasestorage.app",

  messagingSenderId: "108007297391",

  appId: "1:108007297391:web:4d1fced559309715ca189a",

  measurementId: "G-KN6Y40SY8X"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
