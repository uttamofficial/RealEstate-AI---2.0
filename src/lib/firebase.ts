// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY1t5SkQvD028u0q_GGlNYWZ-_HATTbHw",
  authDomain: "realestate-ai-7daf8.firebaseapp.com",
  projectId: "realestate-ai-7daf8",
  storageBucket: "realestate-ai-7daf8.firebasestorage.app",
  messagingSenderId: "526280680518",
  appId: "1:526280680518:web:769e96bd423b68b9141647",
  measurementId: "G-8395HCBKMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export { onAuthStateChanged };

export default app;
