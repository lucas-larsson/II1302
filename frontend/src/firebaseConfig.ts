import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOhC_6nvI0gBi7UIhxL24Bklvo0hZ84nI",
  authDomain: "ii1302-e9182.firebaseapp.com",
  projectId: "ii1302-e9182",
  storageBucket: "ii1302-e9182.appspot.com",
  messagingSenderId: "801044363881",
  appId: "1:801044363881:web:8d0a44b21283cd254640f8",
  measurementId: "G-DMJQNEW35D"
};

firebase.initializeApp(firebaseConfig);

export { firebase };
