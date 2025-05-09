import fetch from 'node-fetch';
import fs from 'fs';
import * as cheerio from 'cheerio';

// URL for Rock Paper Shotgun's Wordle past answers page
const url = 'https://www.rockpapershotgun.com/wordle-past-answers';

async function fetchWordleAnswers() {
  try {
    console.log('Fetching Wordle answers from Rock Paper Shotgun...');
    
    // Fetch the HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Find the "All Wordle answers" section
    // Rock Paper Shotgun uses an h2 element with this text as a header
    const allWordleAnswersHeading = $('h2:contains("All Wordle answers")');
    
    if (allWordleAnswersHeading.length === 0) {
      throw new Error('Could not find "All Wordle answers" section');
    }
    
    // The list of words is inside a list after the heading
    // Let's look for all-caps 5-letter words in the relevant section
    const words = new Set();
    
    // Start with the heading and collect text after it
    // This will capture the bulleted list that follows the heading
    let currentElement = allWordleAnswersHeading;
    let foundWordSection = false;
    
    // Loop through next siblings until we find what looks like another section
    while (currentElement.length > 0) {
      currentElement = currentElement.next();
      
      // If we encounter another heading, we've gone past the word list
      if (currentElement.is('h2')) {
        break;
      }
      
      // Get the text content for this element
      const text = currentElement.text();
      
      // Skip empty elements
      if (!text || text.trim() === '') {
        continue;
      }
      
      foundWordSection = true;
      
      // Extract all uppercase 5-letter words from this text
      // The words might be separated with spaces, *'s, newlines, etc.
      const wordMatches = text.match(/\b[A-Z]{5}\b/g);
      
      if (wordMatches) {
        wordMatches.forEach(word => words.add(word));
      }
    }
    
    // If we didn't find any section with words, report an error
    if (!foundWordSection) {
      throw new Error('Could not find Wordle word list content');
    }
    
    // Convert the Set back to an array and sort alphabetically
    const wordList = Array.from(words).sort();
    
    console.log(`Found ${wordList.length} unique Wordle answers`);
    
    // Save the results to words.json
    fs.writeFileSync('words.json', JSON.stringify(wordList, null, 2));
    console.log('Saved words.json successfully');
    
    return wordList;
  } catch (error) {
    console.error('Error fetching Wordle answers:', error);
    throw error;
  }
}

// Execute the function
fetchWordleAnswers()
  .then(words => {
    console.log(`Completed successfully with ${words.length} words`);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 