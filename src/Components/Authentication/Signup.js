import React from 'react';
import './auth-page.scss';
import { auth, db, handleError } from '../../config/firebase-auth';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { useNavigate } from 'react-router-dom';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


function Signup(){
    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        setErrorMessage('');
        let isVerified = true;
        if (password !== retypePassword) {
            setErrorMessage("Error: Passwords do not match.");
            console.log("Error here.");

            isVerified = false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setErrorMessage("Error: Email is not in valid format.");
            console.log("Error here.");

            isVerified = false;
        }
        if (isVerified) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('User created:', user.uid);

                    set(ref(db, '/users/' + user.uid), {
                        Username: document.getElementById("username").value,
                        Name: document.getElementById("name").value,
                        Email: email
                    }).then(() =>{
                        window.alert("Account Successfully Created.");
                        navigate("/");
                    }).catch((error) => {
                        handleError(error);
                        // setErrorMessage('Error writing to database:'+ error.message);
                    });

                })
            .catch((error) => {
                handleError(error);
            });
    }
    };

    return(    
    <div className="container">
        <section className="login-signup">
            <h2>Sign-up</h2>
            <div className='form'>
                <div className="error-message" id = "error-message"></div>
                <div className="user-input">
                    <label htmlFor="name"> Name: </label>
                    <input id="name" type="text" maxLength="20" minLength="2" value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="user-input">
                    <label htmlFor="username"> Username: </label>
                    <input id="username" type="text" maxLength="20" minLength="2" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                </div>
                <div className="user-input">
                    <label htmlFor="email"> Email:</label>
                    <input id="email" type="email" maxLength="50" value={email} onChange={(e)=>setEmail(e.target.value)}/>  
                </div>
    
                <div className="user-input">
                    <label htmlFor="password"> Password:</label>
                    <input id="password" type="password" maxLength="20" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
    
                <div className="user-input">
                    <label htmlFor="password"> Reenter Password:</label>
                    <input id="reenter-password" type="password" maxLength="20" value={retypePassword} onChange={(e)=>setRetypePassword(e.target.value)}/>
                </div>
                <button value="Sign-up" className="submit-button" id="signup-button" onClick={handleSignUp}>Sign up</button>
            </div>
            <p className="fine-print small">Already a user? Click <a href="./">here</a> to sign in.</p>
        </section>
    </div>
    );
}

export default Signup;