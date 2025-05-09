#!/usr/bin/env python3
import json
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# URL for Rock Paper Shotgun's Wordle past answers page
URL = "https://www.rockpapershotgun.com/wordle-past-answers"

def fetch_wordle_answers():
    """Scrape and extract all Wordle answers from Rock Paper Shotgun."""
    print(f"Fetching Wordle answers from {URL}...")
    
    # Fetch the page content
    try:
        response = requests.get(URL, timeout=30)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None
    
    # Parse the HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the section with all Wordle answers
    # The page structure has an h2 with "All Wordle answers"
    all_answers_heading = soup.find(lambda tag: tag.name == "h2" and "All Wordle answers" in tag.text)
    
    if not all_answers_heading:
        print("Could not find 'All Wordle answers' section")
        return None
    
    # Create a set to store unique words (handles duplicates automatically)
    wordle_words = set()
    
    # Extract words from the content after the heading
    # We'll look at all content until we hit another h2
    current_element = all_answers_heading
    
    while current_element and current_element.find_next_sibling():
        current_element = current_element.find_next_sibling()
        
        # If we hit another h2, we've gone too far
        if current_element.name == "h2":
            break
            
        # Extract text and find 5-letter words in ALL CAPS (Wordle format)
        text = current_element.text
        words = re.findall(r'\b[A-Z]{5}\b', text)
        wordle_words.update(words)
    
    # Convert to a sorted list
    word_list = sorted(list(wordle_words))
    print(f"Found {len(word_list)} unique Wordle answers")
    
    return word_list

def save_results(word_list):
    """Save results to both JSON and simple text files."""
    # Save as JSON
    with open('words.json', 'w') as f:
        json.dump(word_list, f, indent=2)
    
    # Save as simple text file (one word per line)
    with open('words.txt', 'w') as f:
        f.write('\n'.join(word_list))
    
    # Save metadata with timestamp
    metadata = {
        "last_updated": datetime.now().isoformat(),
        "word_count": len(word_list),
        "source": URL
    }
    
    with open('metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Saved {len(word_list)} words to words.json, words.txt, and metadata")

def main():
    """Main entry point for the scraper."""
    word_list = fetch_wordle_answers()
    
    if word_list:
        save_results(word_list)
        print("Scraping completed successfully")
        return True
    else:
        print("Scraping failed")
        return False

if __name__ == "__main__":
    success = main()
    # Return appropriate exit code for GitHub Actions
    exit(0 if success else 1) 