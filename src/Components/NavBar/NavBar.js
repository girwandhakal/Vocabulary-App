import react from 'react';
import { useNavigate } from 'react-router-dom';
import {auth} from '../../config/firebase-auth';
import { signOut  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

function NavBar(){
    const navigate = useNavigate();

    const handleSignOut = (e)=>{
        e.preventDefault();
        signOut(auth).then(() => {
          navigate("/");
        }).catch((error) => {
            console.log(error);
        });
        
      }
      return(
        <nav class="nav-bar">
        <ul class="nav-links">
            <li className="navLink" onClick={()=>(navigate("/home"))}>Home</li>
            <li className="navLink" onClick={()=>(navigate("/review"))}>Review</li>
            <li className="navLink" onClick={()=>(navigate("/quiz"))}>Quiz</li>
            <li className="navLink" onClick={handleSignOut}>Sign Out</li>
        </ul>
        </nav>
      )

}

export default NavBar;