#!/bin/bash

DEV_VAULT_PATH="/Users/jplatta/Library/Mobile Documents/iCloud~md~obsidian/Documents/development_vault/.obsidian/plugins/obsidian-term"

rm -r "$DEV_VAULT_PATH"
mkdir -p "$DEV_VAULT_PATH"

npm install
npm run build

cp ./main.js ../dist
cp ./manifest.json ../dist
cp ./styles.css ../dist
cp ./src/pty_helper.py ../dist

cp ./main.js "$DEV_VAULT_PATH"
cp ./manifest.json "$DEV_VAULT_PATH"
cp ./styles.css "$DEV_VAULT_PATH"
cp ./src/pty_helper.py "$DEV_VAULT_PATH"