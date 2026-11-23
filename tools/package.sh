#!/usr/bin/env bash
# Regenerates the site, the bugs copy, and the zips Husam uploads.
# dist/course-site-netlify.zip  -> drag to Netlify
# dist/backend.zip              -> dotnet publish on his machine, then MonsterASP
set -e
cd "$(dirname "$0")/.."
python3 site-src/gen_pages.py
tools/make-bugs-copy.sh
rm -f dist/course-site-netlify.zip dist/backend.zip dist/course-site-bugs.zip
(cd site && zip -qr ../dist/course-site-netlify.zip .)
(cd dist && zip -qr course-site-bugs.zip course-site-bugs)
zip -qr dist/backend.zip backend -x "backend/bin/*" "backend/obj/*"
ls -la dist/*.zip
