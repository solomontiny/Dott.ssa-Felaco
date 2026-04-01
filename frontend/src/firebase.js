import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyB9Tf6BMss_21HlSxdWZEprMyi66G0nmHk",
  authDomain: "dottssa-felaco-admin.firebaseapp.com",
  projectId: "dottssa-felaco-admin",
  storageBucket: "dottssa-felaco-admin.firebasestorage.app",
  messagingSenderId: "228713849582",
  appId: "1:228713849582:web:8cb7c4ee16c825acb709ff",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider };