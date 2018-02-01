import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyD_Rji0mZIP4MryEYKrAlLXWC4SCPtN4zc",
    authDomain: "hot-app-a4f9d.firebaseapp.com",
    databaseURL: "https://hot-app-a4f9d.firebaseio.com",
    projectId: "hot-app-a4f9d",
    storageBucket: "hot-app-a4f9d.appspot.com",
    messagingSenderId: "496841978144"
};
var fire = firebase.initializeApp(config);
export default fire;