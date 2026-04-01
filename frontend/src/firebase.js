import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9Tf6BMss_21HlSxdWZEprMyi66G0nmHk",
  authDomain: "dottssa-felaco-admin.firebaseapp.com",
  projectId: "dottssa-felaco-admin",
  storageBucket: "dottssa-felaco-admin.firebasestorage.app",
  messagingSenderId: "228713849582",
  appId: "1:228713849582:web:8cb7c4ee16c825acb709ff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;