import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh33_IG1OZRDHgte5BDwef2di9xMsPEyo",
  authDomain: "vega-studios-build.firebaseapp.com",
  projectId: "vega-studios-build",
  storageBucket: "vega-studios-build.appspot.com",
  messagingSenderId: "704575139677",
  appId: "1:704575139677:web:223152ba000409c7e1c2b4",
  measurementId: "G-91XCJCHDKF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
