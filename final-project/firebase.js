import * as firebase from 'firebase';

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA4dH5uRQXnTPjhUBfj4GVkCVoj5c6zAkw",
    authDomain: "final-project-9295c.firebaseapp.com",
    databaseURL: "https://final-project-9295c.firebaseio.com",
    projectId: "final-project-9295c",
    storageBucket: "final-project-9295c.appspot.com",
    messagingSenderId: "195709523811",
    appId: "1:195709523811:web:dc9f87c554882751882556"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  export default firebaseApp;