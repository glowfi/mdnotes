#!/usr/bin/env bash

######### INSTALL #########

if [[ "$1" = "i" ]]; then
	cargo install mdbook
fi

######### Cleanup Oldbook #########

rm -rf mybook
rm -rf *.html *.css *.js *.json *.png *.svg
rm -rf css FontAwesome fonts

######### Create Book #########

mkdir mybook
mdbook init --title="Markdown Notes" --ignore=none mybook

######### Determine Markdowns present #########

markdownCount=$(ls ./notes/*.md | wc -l)
markdownCount=$((markdownCount - 1))

markdownList=$(ls ./notes/*.md | sed '/^$/d' | tr "\n" "," | sed 's/.$//')
IFS=',' read -r -a array <<<"$markdownList"

######### Copy Markdown #########

cp -r ./notes/*.md ./mybook/src/
rm -rf ./mybook/src/notes
rm ./mybook/src/chapter_1.md

######### Create chapters #########

echo "# Summary

" >./mybook/src/SUMMARY.md

for VAR in $(seq 0 "$markdownCount"); do
	file="${array["$VAR"]}"
	chapterName=$(basename "$file" | sed 's/\.[^.]*$//')
	fileName=$(basename "${file}")
	echo "$chapterName"
	echo "- ["${chapterName}"](./${fileName})" >>./mybook/src/SUMMARY.md
done

######### Build book #########

mdbook build ./mybook/

######### Copy book #########

cp -r ./mybook/book/* .
