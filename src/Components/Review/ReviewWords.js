import react, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase-auth';
import { push, set, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import NavBar from '../NavBar/NavBar';
import '../NavBar/NavBar.scss';
import './ReviewWords.scss'
import { onAuthStateChanged, useAuthState } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { useNavigate } from 'react-router-dom';
import WordList from './WordList';
import WordListDefinition from './WordListDefinition';

const ReviewWords = () => {
    const [selectedWord, setSelectedWord] = useState('');
    const navigate = useNavigate();
    const [wordToDelete, setWordToDelete] = useState('');
    const [user_id, setuser_id] = useState('');
    const [wordExist, setWordExist] = useState(false);
    const [userWords, setUserWords] = useState([]);


    const setWord = (word) => {
        setSelectedWord(word);
    }

    const checkWords = async (userID) => { // use it to see if user has added any words or not, used to decide what to render
        try {
            const userWordsRef = ref(db, 'userWordList/' + userID);
            const snapshot = await get(userWordsRef);
            if (snapshot.exists()) {
                setWordExist(true);
            } else {
                setWordExist(false);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkWords(user.uid);
                fetchWords(user.uid);
                setuser_id(user.uid);
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);

    const deleteHelper = (word) => {
        setWordToDelete(word);
    }

    const handleDelete = async () => {
        try {
            if (!wordToDelete || !user_id) {
                return;
            }
            const userWordsRef = ref(db, 'userWordList/' + user_id);
            const snapshot = await get(userWordsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const wordKey = Object.keys(data).find(key => data[key].word === wordToDelete);
                if (wordKey) {
                    await remove(ref(db, 'userWordList/' + user_id + '/' + wordKey));
                    checkWords(user_id);
                    fetchWords(user_id);
                } else {
                    alert("Error deleting word.");
                }

            }
        } catch (error) {
            console.error("Error deleting word:", error);
        }
    }
    const fetchWords = async (userID) => {
        try {
            const userWordsRef = ref(db, 'userWordList/' + userID);
            const snapshot = await get(userWordsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const wordsArray = Object.values(data).map(item => item.word);
                setUserWords(wordsArray);
            } else {
                setUserWords([]);
                console.log("No data available");
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    };

    useEffect(() => {
        if (wordToDelete) {
            handleDelete();
        }
    }, [wordToDelete]);

    return (
        <>
            <div className="page-container">
                <NavBar />
                {wordExist && (
                    <>
                    <p>Click on a word to see its meaning appear on the display on the right.</p>
                    <div className="component-container">
                        <WordList handleSelection={setWord} handleDelete={deleteHelper} userWords={userWords} />
                        <WordListDefinition selectedWord={selectedWord} />
                    </div>
                    </>
                )}
                {!wordExist && 
                (
                    <div className="component-container">
                        <p>You have not added any words yet...</p>
                    </div>
                )
                }
            </div>

        </>
    );

}

export default ReviewWords;