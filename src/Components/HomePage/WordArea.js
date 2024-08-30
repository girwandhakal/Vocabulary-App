import './WordArea.scss';
import React, { useEffect, useState, useRef } from 'react';

const WordArea = ({ selectedWord, wordExist }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState([]);
    const itemRefs = useRef([]);

    useEffect(() => {
        if (selectedWord >= 0 && itemRefs.current[selectedWord]) {
            itemRefs.current[selectedWord].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedWord]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                wordExist(true);
                setLoading(true);
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
                if (!response.ok) {
                    throw new Error("Could not find word");
                }
                const data = await response.json();
                setResult(data);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        }
        if (selectedWord) {
            fetchData();
        }

    }, [selectedWord]);

    const handleMissingWord = (word) => {
        const url = "https://www.google.com/search?q=define+" + word;
        window.open(url, "_blank");
    }


    return (

        <div className="wordArea">
            <div className="resultMessages">
                {loading && <p className='resultMessage'>Loading</p>}
                {!loading && error && (
                    <>
                    {wordExist(false)}
                    <p className='wordArea-resultMessage'>{error}<br/></p>
                    <p className='wordArea-resultMessage link' onClick={() => handleMissingWord(selectedWord)}>Search Google for "{selectedWord}"</p>
                    </>
                )}
                {!loading && !error && result.title === "No Definitions Found" && (
                    <>
                    {wordExist(false)}
                   <p className='wordArea-resultMessage'>{error}<br/></p>
                    <p className='wordArea-resultMessage link' onClick={() => handleMissingWord(selectedWord)}>Search Google for "{selectedWord}"</p>
                    </>
                )}
            </div>
            {!loading && !error && result.length > 0 && result.title !== "No Definitions Found" && (
                <>
                    <h1 className="wordName">{result[0].word}</h1>

                    <div className="meanings">
                        <h3>Meanings:</h3>
                        <ol>
                            {result[0].meanings
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
                    </div>
                </>
            )}


        </div>
    );

}

export default WordArea;