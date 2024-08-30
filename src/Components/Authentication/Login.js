import React from 'react';
import './auth-page.scss';
import { auth,db, handleError } from '../../config/firebase-auth.js';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        try {
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        }
        catch (error) {
            handleError(error);
        }
    }

    return (
        <div className="container">
            <header>
                <h1>VocabPro</h1>
                <p>Welcome! Lets Get Started!</p>
            </header>
            <section className="login-signup">
                <h2>Login</h2>
                <div className="error-message" id="error-message"></div>
                <div className="form">
                    <div className="user-input">
                        <label htmlFor="email"> Email: </label>
                        <input id="email" type="email" maxLength="50" value={email} onChange={(e) => setEmail(e.target.value)} />

                    </div>
                    <div className="user-input">
                        <label htmlFor="password"> Password:</label>
                        <input id="password" type="password" maxLength="20" value={password} onChange={(e) => setPassword(e.target.value)} />

                    </div>
                    <button type="submit" value="Login" className="submit-button" id="login-button" onClick = {handleLogin}>Login</button>
                </div>
                <p className="fine-print small">New user? Click <a href="./signup">here</a> to sign up.</p>
            </section>
            <footer className="footer-area">
                <p>Created by Girwan Dhakal 2024</p>
            </footer>
        </div>

    );
}

export default Login;