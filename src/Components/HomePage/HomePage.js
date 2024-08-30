import React from 'react';
import SearchBar from './SearchBar';
import NavBar from '../NavBar/NavBar';
import './HomePage.scss';
import { onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {auth} from '../../config/firebase-auth';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    onAuthStateChanged(auth, (user)=>{
        if(!user)
            {
                navigate("/");
            }
    });      
    return (
        <div className="home-container">
        <NavBar/>
            <main>
            <SearchBar placeholder="Search for a word ..." />
            </main>
        </div>
    );
}

export default HomePage;
