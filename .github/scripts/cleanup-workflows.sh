#!/bin/bash

# Check if the workflow name is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <workflow_name>"
  echo "Example: $0 'update-words.yml'"
  exit 1
fi

WORKFLOW_NAME="$1"
REPO="rootlake/wordarchive"

echo "Deleting all runs for workflow: $WORKFLOW_NAME"

# Get all workflow run IDs using GitHub CLI
RUN_IDS=$(gh run list --workflow "$WORKFLOW_NAME" --limit 500 --json databaseId -q '.[].databaseId')

# Check if we found any runs
if [ -z "$RUN_IDS" ]; then
  echo "No workflow runs found for workflow '$WORKFLOW_NAME'."
  exit 0
fi

# Count how many runs we found
NUM_RUNS=$(echo "$RUN_IDS" | wc -w | tr -d ' ')
echo "Found $NUM_RUNS workflow runs to delete."

# Loop through each run ID and delete it
for RUN_ID in $RUN_IDS; do
  echo "Deleting run ID $RUN_ID..."
  gh run delete "$RUN_ID"
  # Sleep briefly to avoid rate limiting
  sleep 0.2
done

echo "All workflow runs for '$WORKFLOW_NAME' have been deleted." 