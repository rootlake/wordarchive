document.addEventListener('DOMContentLoaded', () => {
    const wordListContainer = document.getElementById('word-list-container');
    const letterIndexContainer = document.getElementById('letter-index-container');

    if (!wordListContainer || !letterIndexContainer) {
        console.error('Required HTML elements not found.');
        return;
    }

    function displayWords(words, metadata) {
        wordListContainer.innerHTML = ''; // Clear previous words
        letterIndexContainer.innerHTML = ''; // Clear previous index

        if (!words || words.length === 0) {
            wordListContainer.innerHTML = '<p>Word list is empty. This could mean the words.json file is missing or empty. Please check the GitHub Actions workflow.</p>';
            return;
        }

        // Add last updated info at the top
        const lastUpdated = document.createElement('div');
        lastUpdated.classList.add('last-updated');
        
        let lastUpdatedText = `Found ${words.length} Wordle answers. List automatically updates daily.`;
        
        if (metadata && metadata.last_updated) {
            try {
                const updateDate = new Date(metadata.last_updated);
                lastUpdatedText += ` Last refresh: ${updateDate.toLocaleString()}`;
            } catch (e) {
                console.error('Error parsing date:', e);
                lastUpdatedText += ` Last refresh: ${metadata.last_updated}`;
            }
        } else {
            lastUpdatedText += ` Last refresh: ${new Date().toLocaleString()}`;
        }
        
        lastUpdated.innerHTML = `<p>${lastUpdatedText}</p>`;
        wordListContainer.appendChild(lastUpdated);

        words.sort();

        const wordsByLetter = {};
        words.forEach(word => {
            const firstLetter = word[0].toUpperCase();
            if (!wordsByLetter[firstLetter]) {
                wordsByLetter[firstLetter] = [];
            }
            wordsByLetter[firstLetter].push(word);
        });

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        alphabet.forEach(letter => {
            if (wordsByLetter[letter]) {
                const button = document.createElement('a');
                button.href = `#letter-${letter}`;
                button.textContent = letter;
                button.classList.add('letter-index-button');
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetElement = document.getElementById(`letter-${letter}`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                letterIndexContainer.appendChild(button);
            }
        });
        
        for (const letter of alphabet) {
            if (wordsByLetter[letter] && wordsByLetter[letter].length > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.classList.add('word-group');
                groupDiv.id = `letter-${letter}`;

                const letterHeading = document.createElement('h2');
                letterHeading.textContent = letter;
                groupDiv.appendChild(letterHeading);

                wordsByLetter[letter].forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.classList.add('word-item');
                    wordSpan.textContent = word;
                    groupDiv.appendChild(wordSpan);
                });
                wordListContainer.appendChild(groupDiv);
            }
        }
    }

    // Add a loading indicator
    wordListContainer.innerHTML = '<p>Loading Wordle answers...</p>';

    // Fetch metadata.json first
    fetch('./metadata.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load metadata');
            }
            return response.json();
        })
        .then(metadata => {
            // Now fetch words.json
            return fetch('./words.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json().then(words => ({ words, metadata }));
                });
        })
        .then(data => {
            displayWords(data.words, data.metadata);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // If we failed to get metadata, try just getting the words
            if (error.message === 'Could not load metadata') {
                fetch('./words.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(words => {
                        displayWords(words, null);
                    })
                    .catch(wordsError => {
                        console.error('Error fetching words.json:', wordsError);
                        wordListContainer.innerHTML = `
                            <p>Could not load word list. The GitHub Action may not have run yet or encountered an error.</p>
                            <p>Technical details: ${wordsError.message}</p>
                        `;
                    });
            } else {
                wordListContainer.innerHTML = `
                    <p>Could not load word list. The GitHub Action may not have run yet or encountered an error.</p>
                    <p>Technical details: ${error.message}</p>
                `;
            }
        });
}); 