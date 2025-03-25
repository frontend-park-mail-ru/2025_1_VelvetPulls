#!/bin/bash

find . -type f -name "*.hbs" | while read -r template; do
    precompiled_file="${template%.hbs}.precompiled.js"
    echo $template $precompiled_file
    handlebars $template -f $precompiled_file
done
