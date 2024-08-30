import React, { useState, useEffect, useRef } from "react";
import './SearchBar.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useClickOutside } from 'react-click-outside-hook';
import WordArea from './WordArea.js';
import ClearIcon from '@mui/icons-material/Clear';
import {auth, db, handleError} from '../../config/firebase-auth.js';
import { push, set, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

function SearchBar({ placeholder }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState([]);
    const [resultSpace, setResultSpace] = useState(false);
    const [refClickOutside, isClickedOutside] = useClickOutside();
    const [wordSpace, setWordSpace] = useState(false);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [wordExist, setWordExist] = useState(true);
    const resultContainer = useRef([]);

    const handleWordResult = (bool) =>{
        setWordExist(bool);
    }

    const handleOnKeyDown = (e) => {
        if (result.length > 0 && !wordSpace) {
            if (e.key === "ArrowUp") {
                setSelectedItem((selectedItem - 1) < 0 ? result.length - 1 : selectedItem - 1);
                setSearchTerm(result[(selectedItem - 1) < 0 ? result.length - 1 : selectedItem - 1].word);
            }
            else if (e.key === "ArrowDown") {
                setSelectedItem((selectedItem + 1) % result.length);
                setSearchTerm(result[(selectedItem + 1) % result.length].word);
            }
            else if (e.key === "Escape") {
                clearEverything();
            }
            else if (e.key === "Enter") {
                handleWordClick(searchTerm);
            }
        }
        else {
            setSelectedItem(-1);
        }
    }


    const handleInputChange = async (event) => {
        openResultDisplay();
        const word = event.target.value;
        setSearchTerm(word);
        setLoading(true);
        setResult([]);
        setError('');
        if (word.length === 0) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            const data = await response.json();
            setResult(data);

        } catch (error) {
            setError(error);

        } finally {
            setLoading(false);
        }
    }

    const openResultDisplay = () => {
        setResultSpace(true);
        setWordSpace(false);

    }
    const closeResultDisplay = () => {
        setResultSpace(false);
    }

    useEffect(() => {
        if (isClickedOutside) {
            closeResultDisplay();
        }
    }, [isClickedOutside]);

    useEffect(() => {
        if (resultContainer.current[selectedItem]) {
            resultContainer.current[selectedItem].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedItem]);


    const clearEverything = () => {
        setResultSpace(false);
        setSearchTerm('');
        setWordSpace(false);
        setWordExist(false);
    }

    const handleWordClick = (word) => {
        setSearchTerm(word);
        closeResultDisplay();
        setWordSpace(true);
    }
    const fetchWords = async (userID) => { // returns all the words of the user, used to prevent duplicate entry
        try {
            const userWordsRef = ref(db, 'userWordList/' + userID);
            const snapshot = await get(userWordsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const wordsArray = Object.values(data).map(item => item.word.trim().toLowerCase());
                return wordsArray;
            } else {
                console.log("No data available");
                return []; // Return an empty array if no data is available
            }
        } catch (error) {
            console.error("Error fetching words:", error);
            return []; // Return an empty array in case of error
        }
    };
    
    const handleAddWord = async (searchTerm) => {
        try {
            const userID = auth.currentUser.uid;
            console.log("User ID: ", userID);
            const currentWords = await fetchWords(userID);
    
            if (currentWords.includes(searchTerm.trim().toLowerCase())) {
                alert("Unable to add word : Word already added!");
                return;
            }
    
            await set(push(ref(db, '/userWordList/' + userID)), {
                word: searchTerm
            });
            clearEverything();
        } catch (error) {
            console.error("Error adding word:", error);
            alert("Failed to add word: " + error.message);
        }
    };
    


    return (
        <div className="search" ref={refClickOutside}>
            <div className="searchInputs">
                <div className="searchIcon">
                    <SearchIcon />
                </div>
                <input className="input-box" type="text" placeholder={placeholder} value={searchTerm} onChange={handleInputChange} onKeyDown={handleOnKeyDown} maxLength={45} />
                <div className="clear-icon">
                    <ClearIcon onClick={() => clearEverything()} />
                </div>
            </div>
            {resultSpace && (
                <div className="result" id="resultSpace">
                    {searchTerm.length === 0 && <p className="resultMessage">Type a word</p>}
                    {loading && <p className="resultMessage">Loading</p>}
                    {!loading && result.length === 0 && searchTerm.length !== 0 && <p className="resultMessage">No Matching Words Found</p>}
                    {result && (<ul className="resultList">
                        {result.map((key, index) => (
                            <li key={index} className={index === selectedItem ? "resultItem active" : "resultItem"} onClick={() => handleWordClick(key.word)} ref={(el) => (resultContainer.current[index] = el)} >
                                {key.word}
                            </li>
                        )
                        )}
                    </ul>)}
                </div>
            )}
            {wordSpace && (
                <div className="wordSpace">
                    <div className="wordContainer">
                        <WordArea selectedWord={searchTerm} wordExist = {handleWordResult} />
                        {wordExist && (<div className="wordOptions">
                            <button type="button" className="wordButton" onClick={()=>handleAddWord(searchTerm)}>Add word</button>
                            <button type="button" className="wordButton cancel" onClick={() => clearEverything()}>Cancel</button>
                        </div>)}
                    </div>

                </div>

            )}


        </div>
    );
}

export default SearchBar;