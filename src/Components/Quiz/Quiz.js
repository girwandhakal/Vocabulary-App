import react, { useState, useEffect } from 'react';
import './Quiz.scss';
import NavBar from '../NavBar/NavBar';
import { auth, db } from '../../config/firebase-auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { push, set, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { onAuthStateChanged, useAuthState } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Quiz = () => {
    const [userWords, setUserWords] = useState([]);
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();
    const [wordExist, setWordExist] = useState(false); // if user has added words or not
    const [flashCardWords, setFlashCardWords] = useState([]); // array of words in order
    const [currentWord, setCurrentWord] = useState(-1); // current word in flashcard
    const [showMeaning, setShowMeaning] = useState(false);
    const [loading, setLoading] = useState(true); // loading state
    const [currentResult, setCurrentResult] = useState([]); //meanings for the current word
    const [flipped, setFlipped] = useState(false);

    //shuffles word order
    const randomizeWords = () => {
        const randomArr = [...userWords];
        randomArr.sort(() => (Math.random() - 0.5));
        setFlashCardWords(randomArr);
    }
    // fetches the user's words from database, updates userWords state
    const fetchWords = async (userID) => {
        try {
            const userWordsRef = ref(db, 'userWordList/' + userID);
            const snapshot = await get(userWordsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const wordsArray = Object.values(data).map(item => item.word);
                setUserWords(wordsArray); 
                setWordExist(true);
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    };

    //fetches meaning for current word
    const fetchData = async () => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${flashCardWords[currentWord]}`);
            if (!response.ok) {
                throw new Error("Could not find word");
            }
            const data = await response.json();
            setCurrentResult(data);

        } catch (error) {
            console.log(error.message);
        }
    }

    // called once when page loads
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchWords(user.uid).then(() => { // fetches user's words and stores in userWords hook
                    setUserID(user.uid);
                    setLoading(false);
                })
            } else {
                navigate('/');// Reroute if user is not logged in 
            }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);

    // if the user has any words then shuffle it
    useEffect(() => {
        if (userWords.length > 0) { // only want to call randomize words when userWords is populated
            randomizeWords();
            setCurrentWord(0);
        }
    }, [userWords])

    useEffect(() => {
        fetchData(); // updates currentResult with meaning of currentWord
    }, [currentWord]);

    // handles forward click of button
    const handleForwardClick = () => {
        setShowMeaning(false);
        if (currentWord + 1 > userWords.length - 1) {
            setCurrentWord(userWords.length - 1);
        }
        else {
            setCurrentWord(currentWord + 1);
        }
    }

    // handles back click of button
    const handleBackClick = () => {
        console.log("it works");
        setShowMeaning(false);

        if (currentWord - 1 < 0) {
            setCurrentWord(0);
        }
        else {
            setCurrentWord(currentWord - 1);

        }
    }

    // called when flashcard is clicked
    const handleFlip = () => {
        setShowMeaning(!showMeaning);
        setFlipped(!flipped);
    }



    return (
        <>
            <div className="page-container">
                <NavBar />
                <div className="quiz-container">
                    {loading ? (
                        <p>Loading</p>
                    ) : (
                        wordExist ? (
                            <>
                                <div className='flashcard-container'>
                                    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                                        {!showMeaning ? (
                                            <p className="tempWord">{flashCardWords[currentWord]}</p>
                                        ) : (
                                            <ol>
                                                {currentResult[0].meanings
                                                    .flatMap(meaning =>
                                                        meaning.definitions.slice(0, 2).map((definition, index) => (
                                                            <li key={index} className="wordItem">
                                                                <p className="meaning">{definition.definition}</p>
                                                                {definition.example && <p className="example">"{definition.example}"</p>}
                                                            </li>
                                                        ))
                                                    )
                                                    .slice(0, 4)} {/* Limit to the first 4 definitions */}
                                            </ol>
                                        )}
                                    </div>
                                    <div className="flashcard-tools">
                                        <NavigateBeforeIcon color='black' onClick={handleBackClick} />
                                        <p className="flashcard-number">
                                            {`${currentWord + 1}/${userWords.length}`}
                                        </p>
                                        <NavigateNextIcon color='black' onClick={handleForwardClick} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Add some words and check back here.</p>
                        )
                    )}

                </div>
            </div>
        </>
    );
}

export default Quiz;