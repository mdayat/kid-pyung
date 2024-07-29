import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPZZz56CRUDJoqNRLkh8UzJl-T482oMss",
  authDomain: "emteka-56d19.firebaseapp.com",
  projectId: "emteka-56d19",
  storageBucket: "emteka-56d19.appspot.com",
  messagingSenderId: "842243402007",
  appId: "1:842243402007:web:b9bc7535fcad284caa6f52",
  measurementId: "G-ZQL6F6KXDB",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
