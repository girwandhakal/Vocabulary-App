import react, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase-auth';
import { push, set, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
//import './NavBar.scss';
import './WordList.scss'
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const WordList = ({ handleSelection, handleDelete, userWords }) => {
    // const [words, setWords] = useState([]);
    const [selectedKey, setSelectedKey] = useState(-1);
    //const navigate = useNavigate();
    const handleClick = (word, index) => {
        
        if (index === selectedKey) { // if user clicks on key that is being selected
            setSelectedKey(-1);     // unselect the key
            handleSelection('');
        }
        else {
            setSelectedKey(index);  // else make that the selected key
            handleSelection(word);
        }
    }

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             //fetchWords(user.uid);
    //         } else {
    //             navigate('/');
    //         }
    //     });

    //     return () => unsubscribe(); // Cleanup subscription on unmount
    // }, [navigate]);


    // const fetchWords = async (userID) => {
    //     try {
    //         const userWordsRef = ref(db, 'userWordList/' + userID);
    //         const snapshot = await get(userWordsRef);
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             const wordsArray = Object.values(data).map(item => item.word);
    //             setWords(wordsArray);
    //         } else {
    //             console.log("No data available");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching words:", error);
    //     }
    // };


    return (
        <>
            <div className="wordlist-component">
                {userWords.length > 0 && <p className="wordCount">{userWords.length} words added</p>}
                <div className='wordlist-container'>
                    {userWords.length > 0 ? userWords.map((word, index) => (
                        <div className={`itemContainer ${index === selectedKey ? 'selected' : ''}`} onClick={() => (handleClick(word, index))}>
                            <div className='deleteButton' onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(word);
                                }}>
                                <DeleteIcon color='black' />
                            </div>
                            {word}
                        </div>
                    )) : (<p>You have not added any words yet.</p>)}
                </div>
            </div>
        </>
    )

}

export default WordList;