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

fileList=$(find ./notes -type f -iname "*.png" -o -iname "*.md" | sort -Vk1 | sed '/^$/d' | tr "\n" "," | sed 's/.$//')
fileCount=$(echo "$fileList" | wc -l)
IFS=',' read -r -a array <<<"$fileList"

######### Copy Markdown #########

for file in "${array[@]}"; do
	cp -r "${file}" ./mybook/src/
done

rm -rf ./mybook/src/notes
rm ./mybook/src/chapter_1.md

######### Create chapters #########

echo "# Summary

" >./mybook/src/SUMMARY.md

for file in "${array[@]}"; do
	case "${file##*.}" in
	[Pp][Nn][Gg]) continue ;;
	esac
	echo "$file"
	chapterName=$(basename "$file" | sed 's/\.[^.]*$//')
	fileName=$(basename "${file}")
	echo "- ["${chapterName}"](./${fileName})" >>./mybook/src/SUMMARY.md
done

######### Build book #########

mdbook build ./mybook/

######### Copy book #########

cp -r ./mybook/book/* .
