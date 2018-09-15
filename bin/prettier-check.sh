#!/bin/bash

if [[ $($(npm bin)/prettier --list-different "**/*.js") ]]; then
    echo "Please run prettier: \`npm run prettier\`"
    echo ""
    exit 1
fi
