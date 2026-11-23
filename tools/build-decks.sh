#!/usr/bin/env bash
# Builds the Arabic decks from their sources into decks/out/.
# Needs: node + pptxgenjs react react-dom react-icons sharp  (npm i -g or in decks/)
# Usage: tools/build-decks.sh [1|2|3|4]   (no argument = all)
set -e
cd "$(dirname "$0")/../decks"
build() {
  case "$1" in
    1) cp day1.js .build.js ;;
    2) cat head2.js body2.js > .build.js ;;
    3) cat head3.js body3.js > .build.js ;;
    4) cat head4.js helpers4.js body4.js > .build.js ;;
  esac
  node .build.js
  rm -f .build.js
}
names=([1]="اليوم-الأول-تحليل-الاحتياج-وتخطيط-المشروع" [2]="اليوم-الثاني-تصميم-الواجهة-وتجربة-المستخدم" [3]="اليوم-الثالث-بناء-الموقع" [4]="اليوم-الرابع-الاختبار-والإصلاح")
for d in ${1:-1 2 3 4}; do
  build "$d"
  mv "day$d-ar.pptx" "out/${names[$d]}.pptx"
  echo "built out/${names[$d]}.pptx"
done
