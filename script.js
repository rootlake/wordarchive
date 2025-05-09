document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: The following word list is derived from the provided text,
    // which was truncated. You will need to replace this with the full list
    // of Wordle answers from "ABACK" to "ZESTY" from the source page 
    // (https://www.rockpapershotgun.com/wordle-past-answers).
    // The original source lists words one per line, often prefixed with "* ".
    // Example of current partial list: ['ABACK', 'ABASE', ..., 'ELBOW']
    const wordList = ['ABACK', 'ABASE', 'ABATE', 'ABBEY', 'ABIDE', 'ABOUT', 'ABOVE', 'ABYSS', 'ACORN', 'ACRID', 'ACTOR', 'ACUTE', 'ADAGE', 'ADAPT', 'ADEPT', 'ADMIT', 'ADOBE', 'ADOPT', 'ADORE', 'ADULT', 'AFFIX', 'AFTER', 'AGAIN', 'AGAPE', 'AGATE', 'AGENT', 'AGILE', 'AGING', 'AGLOW', 'AGONY', 'AGREE', 'AHEAD', 'AISLE', 'ALBUM', 'ALERT', 'ALIEN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALOFT', 'ALONE', 'ALOOF', 'ALOUD', 'ALPHA', 'ALTAR', 'ALTER', 'AMASS', 'AMBER', 'AMBLE', 'AMISS', 'AMPLE', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'ANGST', 'ANODE', 'ANTIC', 'ANVIL', 'AORTA', 'APART', 'APHID', 'APPLE', 'APPLY', 'APRON', 'APTLY', 'ARBOR', 'ARDOR', 'ARGUE', 'AROMA', 'ARROW', 'ARTSY', 'ASCOT', 'ASHEN', 'ASIDE', 'ASKEW', 'ASSET', 'ATLAS', 'ATOLL', 'ATONE', 'AUDIO', 'AUDIT', 'AVAIL', 'AVERT', 'AWAIT', 'AWAKE', 'AWARD', 'AWASH', 'AWFUL', 'AXIOM', 'AZURE', 'BACON', 'BADGE', 'BADLY', 'BAGEL', 'BAKER', 'BALMY', 'BALSA', 'BANAL', 'BARGE', 'BASIC', 'BASIN', 'BASTE', 'BATHE', 'BATON', 'BATTY', 'BAWDY', 'BAYOU', 'BEACH', 'BEADY', 'BEAST', 'BEAUT', 'BEEFY', 'BEGET', 'BEGIN', 'BEING', 'BELCH', 'BELIE', 'BELLY', 'BELOW', 'BENCH', 'BERET', 'BERTH', 'BESET', 'BEVEL', 'BINGE', 'BIOME', 'BIRCH', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLAND', 'BLARE', 'BLAZE', 'BLEAK', 'BLEED', 'BLEEP', 'BLIMP', 'BLISS', 'BLOCK', 'BLOKE', 'BLOND', 'BLOWN', 'BLUFF', 'BLURB', 'BLURT', 'BLUSH', 'BOAST', 'BONUS', 'BOOBY', 'BOOST', 'BOOTY', 'BOOZE', 'BOOZY', 'BORAX', 'BOSSY', 'BOUGH', 'BOXER', 'BRACE', 'BRAID', 'BRAIN', 'BRAKE', 'BRASH', 'BRASS', 'BRAVE', 'BRAVO', 'BRAWN', 'BREAD', 'BREAK', 'BREED', 'BRIAR', 'BRIBE', 'BRIDE', 'BRIEF', 'BRINE', 'BRING', 'BRINK', 'BRINY', 'BRISK', 'BROAD', 'BROKE', 'BROOK', 'BROOM', 'BROTH', 'BROWN', 'BRUSH', 'BRUTE', 'BUDDY', 'BUGGY', 'BUGLE', 'BUILD', 'BUILT', 'BULKY', 'BULLY', 'BUNCH', 'BURLY', 'CABLE', 'CACAO', 'CACHE', 'CADET', 'CAMEL', 'CAMEO', 'CANDY', 'CANNY', 'CANOE', 'CANON', 'CAPER', 'CARAT', 'CARGO', 'CAROL', 'CARRY', 'CARVE', 'CATCH', 'CATER', 'CAULK', 'CAUSE', 'CEDAR', 'CHAFE', 'CHAIN', 'CHALK', 'CHAMP', 'CHANT', 'CHAOS', 'CHARD', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHEER', 'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHIME', 'CHOCK', 'CHOIR', 'CHOKE', 'CHORD', 'CHORE', 'CHOSE', 'CHUNK', 'CHUTE', 'CIDER', 'CIGAR', 'CINCH', 'CIRCA', 'CIVIC', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLEFT', 'CLERK', 'CLICK', 'CLIMB', 'CLING', 'CLOAK', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOVE', 'CLOWN', 'CLUCK', 'COACH', 'COAST', 'COCOA', 'COLON', 'COMET', 'COMMA', 'CONDO', 'CONIC', 'CORER', 'CORNY', 'COULD', 'COUNT', 'COURT', 'COVER', 'COVET', 'COWER', 'COYLY', 'CRAFT', 'CRAMP', 'CRANE', 'CRANK', 'CRASS', 'CRATE', 'CRAVE', 'CRAWL', 'CRAZE', 'CRAZY', 'CREAK', 'CREAM', 'CREDO', 'CREPE', 'CREPT', 'CREST', 'CRIME', 'CRIMP', 'CRISP', 'CROAK', 'CRONE', 'CROOK', 'CROSS', 'CROWD', 'CROWN', 'CRUMB', 'CRUSH', 'CRUST', 'CRYPT', 'CUMIN', 'CURLY', 'CURSE', 'CYBER', 'CYNIC', 'DADDY', 'DAISY', 'DANCE', 'DANDY', 'DEATH', 'DEBIT', 'DEBUG', 'DEBUT', 'DECAL', 'DECAY', 'DECOY', 'DECRY', 'DEITY', 'DELAY', 'DELTA', 'DELVE', 'DENIM', 'DEPOT', 'DEPTH', 'DETER', 'DEVIL', 'DIARY', 'DICEY', 'DIGIT', 'DINER', 'DINGO', 'DINGY', 'DIRGE', 'DISCO', 'DITTO', 'DITTY', 'DODGE', 'DOGMA', 'DOING', 'DOLLY', 'DONOR', 'DONUT', 'DOPEY', 'DOUBT', 'DOWRY', 'DOZEN', 'DRAFT', 'DRAIN', 'DRAWN', 'DREAM', 'DRINK', 'DRIVE', 'DROLL', 'DROOL', 'DROOP', 'DROVE', 'DRYER', 'DUCHY', 'DUMMY', 'DUTCH', 'DUVET', 'DWARF', 'DWELL', 'DWELT', 'EAGLE', 'EARLY', 'EARTH', 'EASEL', 'EBONY', 'EDICT', 'EGRET', 'EJECT', 'ELBOW'];

    const wordListContainer = document.getElementById('word-list-container');
    const letterIndexContainer = document.getElementById('letter-index-container');

    if (!wordListContainer || !letterIndexContainer) {
        console.error('Required HTML elements not found.');
        return;
    }

    // Sort words just in case, though they should be alphabetical
    wordList.sort();

    const wordsByLetter = {};
    wordList.forEach(word => {
        const firstLetter = word[0].toUpperCase();
        if (!wordsByLetter[firstLetter]) {
            wordsByLetter[firstLetter] = [];
        }
        wordsByLetter[firstLetter].push(word);
    });

    // Create letter index
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(letter => {
        if (wordsByLetter[letter]) { // Only create buttons for letters that have words
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
    
    // Display words grouped by letter
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

    if (wordList.length === 0) {
        wordListContainer.innerHTML = '<p>No words found or list is empty. Please check the `wordList` in `script.js` and ensure it is populated correctly.</p>';
    }
}); 