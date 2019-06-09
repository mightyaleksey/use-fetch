#!/bin/sh

mkdir -p dist
# unminified
browserify src/index.js \
  -p browser-pack-flat \
  -p deumdify \
  --standalone usefetch > dist/index.js
# minified
browserify src/index.js \
  -p deumdify \
  -p tinyify \
  --standalone usefetch > dist/index.min.js
