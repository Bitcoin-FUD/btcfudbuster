# Bitcoin Fudbuster
Twitter Bot to Bust Bitcoin FUD

# Dependencies

If not installed, install nodeJS from https://nodejs.org/en/

Then execute to install required packages

`npm install`
# Installation
1. Copy `config.dist.mjs` to `config.mjs`
2. Fill Twitter API credentials
3. In `run.mjs`

# Adding Articles

You can fork this repository to add articles to the `material/` folder.

## Data Structure
The data format is JSON. Each entry contains the following fields:

- tags: relevant tags to find relevant answers
- answer: the pure answer text
- links: the links that will be added to the answer. Multiple links are possible, the bot will chose a random link from the list.
# Testing queries

You can test queries by running

`node query.mjs`

You'll be prompted for the query and upon hitting enter you get the most relevant result as it would be tweeted.