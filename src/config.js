import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-rWGA1D0h1SzuX4l60T86slMJZFxc87c",
  authDomain: "zekir-a2bba.firebaseapp.com",
  projectId: "zekir-a2bba",
  storageBucket: "zekir-a2bba.appspot.com",
  messagingSenderId: "138730176622",
  appId: "1:138730176622:web:cd45f9cee219a6de72a67f",
  measurementId: "G-0T6QTVHSRR"
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);