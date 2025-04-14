#!/bin/bash

find . -type f -name "*.hbs" | while read -r template; do
    precompiled_file="${template%.hbs}.precompiled.js"
    handlebars $template -f $precompiled_file
done
