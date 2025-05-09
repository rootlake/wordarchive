// Use ES modules syntax for Vite compatibility
document.addEventListener('DOMContentLoaded', () => {
    const wordListContainer = document.getElementById('word-list-container');
    const letterIndexContainer = document.getElementById('letter-index-container');

    if (!wordListContainer || !letterIndexContainer) {
        console.error('Required HTML elements not found.');
        return;
    }

    function displayWords(words) {
        wordListContainer.innerHTML = ''; // Clear previous words
        letterIndexContainer.innerHTML = ''; // Clear previous index

        if (!words || words.length === 0) {
            wordListContainer.innerHTML = '<p>Word list is empty. This could mean the words.json file is missing or empty. Please check the GitHub Actions workflow.</p>';
            return;
        }

        // Add last updated info at the top
        const lastUpdated = document.createElement('div');
        lastUpdated.classList.add('last-updated');
        lastUpdated.innerHTML = `
            <p>Found ${words.length} Wordle answers. 
            List automatically updates daily. Last refresh: ${new Date().toLocaleString()}</p>
        `;
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

    // Fetch the words from words.json
    // Handle both local and GitHub Pages paths
    const wordsJsonPath = window.location.pathname.includes('/wordarchive/') 
        ? 'words.json'  // In GitHub Pages
        : 'words.json'; // Local development
        
    fetch(wordsJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWords(data); // `data` is the array of words
        })
        .catch(error => {
            console.error('Error fetching or parsing words.json:', error);
            wordListContainer.innerHTML = `
                <p>Could not load word list. The GitHub Action may not have run yet or encountered an error.</p>
                <p>Technical details: ${error.message}</p>
            `;
        });
}); 