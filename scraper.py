#!/usr/bin/env python3
import json
import re
import requests
import time
import sys
from bs4 import BeautifulSoup
from datetime import datetime, timezone

# URL for Rock Paper Shotgun's Wordle past answers page
URL = "https://www.rockpapershotgun.com/wordle-past-answers"

def fetch_wordle_answers(max_retries=3, retry_delay=5):
    """Scrape and extract all Wordle answers from Rock Paper Shotgun."""
    print(f"Fetching Wordle answers from {URL}...")
    
    # Retry logic for network errors
    for attempt in range(max_retries):
        try:
            # Fetch the page content with a generous timeout
            response = requests.get(URL, timeout=30)
            response.raise_for_status()  # Raise an exception for HTTP errors
            break  # Success, exit the retry loop
        except requests.exceptions.RequestException as e:
            print(f"Error fetching the page (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Failed to fetch page after {max_retries} attempts")
                return None
    
    # Parse the HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the section with all Wordle answers
    # The page structure has an h2 with "All Wordle answers"
    all_answers_heading = soup.find(lambda tag: tag.name == "h2" and "All Wordle answers" in tag.text)
    
    if not all_answers_heading:
        print("ERROR: Could not find 'All Wordle answers' section in the page")
        print("The page structure may have changed. Please update the scraper.")
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
    word_count = len(word_list)
    
    if word_count == 0:
        print("ERROR: No words found. The page format may have changed.")
        return None
    
    print(f"SUCCESS: Found {word_count} unique Wordle answers")
    
    return word_list

def load_current_words():
    """Load the current word list to check for changes."""
    try:
        with open('words.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_results(word_list):
    """Save results to both JSON and simple text files."""
    # First check if there are any changes from the current file
    current_words = load_current_words()
    
    # Check for differences
    if current_words == word_list:
        print("No changes detected in word list")
    else:
        new_words = set(word_list) - set(current_words)
        if new_words:
            print(f"Found {len(new_words)} new words: {', '.join(sorted(new_words))}")
    
    # Save as JSON
    with open('words.json', 'w') as f:
        json.dump(word_list, f, indent=2)
    
    # Save as simple text file (one word per line)
    with open('words.txt', 'w') as f:
        f.write('\n'.join(word_list))
    
    # Save metadata with timestamp (use UTC time to avoid timezone issues)
    timestamp = datetime.now(timezone.utc).isoformat()
    metadata = {
        "last_updated": timestamp,
        "word_count": len(word_list),
        "source": URL
    }
    
    with open('metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Saved {len(word_list)} words to words.json, words.txt, and metadata")
    print(f"Last updated: {timestamp}")

def main():
    """Main entry point for the scraper."""
    print("====== Wordle Answer Scraper Started ======")
    print(f"Running at: {datetime.now(timezone.utc).isoformat()}")
    
    word_list = fetch_wordle_answers()
    
    if word_list:
        save_results(word_list)
        print("====== Scraping completed successfully ======")
        return True
    else:
        print("====== Scraping failed ======")
        return False

if __name__ == "__main__":
    success = main()
    # Return appropriate exit code for GitHub Actions
    exit_code = 0 if success else 1
    print(f"Exiting with code: {exit_code}")
    sys.exit(exit_code) 