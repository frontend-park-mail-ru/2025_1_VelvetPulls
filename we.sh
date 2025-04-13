#!/bin/sh

# Найти и переименовать все файлы .css в .scss
find . -type f -name "*.css" | while read file; do
    mv "$file" "${file%.css}.scss"
done