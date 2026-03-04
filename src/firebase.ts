import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv3IaxnbONKrN83akW0gOs6zFg2yP1uR4",
  authDomain: "gymcheck-65130.firebaseapp.com",
  projectId: "gymcheck-65130",
  storageBucket: "gymcheck-65130.firebasestorage.app",
  messagingSenderId: "938689881138",
  appId: "1:938689881138:web:327adf66ea5e0480f2082b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
