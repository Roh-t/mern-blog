// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "mern1-blog-4650b.firebaseapp.com",
  projectId: "mern1-blog-4650b",
  storageBucket: "mern1-blog-4650b.firebasestorage.app",
  messagingSenderId: "975396737945",
  appId: "1:975396737945:web:19fa45633a2c8282293908"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}