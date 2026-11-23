#!/usr/bin/env bash
# Day 4 exercise: a copy of the site with 5 planted bugs (and without the admin page).
# Output: dist/course-site-bugs/
set -e
cd "$(dirname "$0")/.."
rm -rf dist/course-site-bugs && mkdir -p dist && cp -r site dist/course-site-bugs
cd dist/course-site-bugs
sed -i 's|href="style.css"|href="styles.css"|' program.html                       # 1) CSS not loading on program page
sed -i 's|images/hero.jpg|images/Hero.jpg|g' css/index.css                        # 2) hero image (case)
sed -i "s|document.querySelector('.faq-item');|document.querySelector('.faq-itm');|" js/accordion.js  # 3) accordion
sed -i 's| dir="rtl"||' trainer.html                                               # 4) RTL missing
sed -i 's|<li><a href="contact.html"|<li><a href="contactus.html"|g' *.html       # 5) broken nav link
rm -f admin.html js/admin.js css/admin.css
echo "dist/course-site-bugs ready"
