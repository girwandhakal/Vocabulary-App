import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { useNavigate } from 'react-router-dom';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE4Y8h5Zbhvtgu60sANWqSkMJEnNXcdps",
    authDomain: "vocab-pro-ce68a.firebaseapp.com",
    projectId: "vocab-pro-ce68a",
    storageBucket: "vocab-pro-ce68a.appspot.com",
    messagingSenderId: "966027649441",
    appId: "1:966027649441:web:529b9f8b21cf25cfc6ebe0",
    databaseURL: "https://vocab-pro-ce68a-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);



const handleError = (error) =>{
    const errorCode = error.code;
    const errorMessage = error.message;
    let errorMessageText = 'Error : ';

    switch (errorCode) {
      case 'auth/invalid-credential':
        errorMessageText = 'Password or Email provided is incorrect.';
        break;
      case 'auth/user-disabled':
        errorMessageText = 'The user account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMessageText = 'Too many unsuccessful login attempts. Please try again later.';
        break;
      case 'auth/email-already-in-use':
        errorMessageText = 'Email is already in use'
      default:
        errorMessageText = errorMessage;
    }

    document.getElementById("error-message").textContent = errorMessageText;
    document.getElementById("error-message").style.display = 'block';
}

export {auth, db, handleError};
