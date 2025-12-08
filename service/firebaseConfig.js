// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirestore } from 'firebase/firestore';
// export type { User };
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC22IRQMd5GeNDzDE1lNegnVeAerH7yMJU",
  authDomain: "notesinbackup.firebaseapp.com",
  projectId: "notesinbackup",
  storageBucket: "notesinbackup.firebasestorage.app",
  messagingSenderId: "52194845788",
  appId: "1:52194845788:web:9a71a24a4923a2bae93299",
  measurementId: "G-QJTK40PP6V"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Paksa pakai jalur yang lebih stabil
});
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


const User = auth.currentUser;

export { auth, db, onAuthStateChanged, User };
export default auth;
