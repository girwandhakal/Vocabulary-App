import react, { useState, useEffect } from 'react';
import './WordListDefinition.scss';

const WordListDefinition = ({ selectedWord }) => {
    const [result, setResult] = useState([]);

    const fetchWordDefinition = async () => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
            if (!response.ok) {
                throw new Error("Could not find word");
            }
            const data = await response.json();
            setResult(data);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => { // everytime selectedWord changes it fetches word def
        if (selectedWord) {
            fetchWordDefinition();
        }
        else
        {
            setResult([]);
        }
    }, [selectedWord])

    return (
        <>
            <div className="definition-container">

            {result.length > 0 && result.title !== "No Definitions Found" && (
                <>

                <h1 className="wordName wordListName">{result[0].word}</h1>

                <div className="meanings wordListMeanings">
                    <h3>Meanings:</h3>
                    <ol>
                        { result[0].meanings
                            .flatMap(meaning =>
                                meaning.definitions.slice(0, 2).map((definition, index) => (
                                    <li className="wordItem">
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

        </>
    );
}

export default WordListDefinition;