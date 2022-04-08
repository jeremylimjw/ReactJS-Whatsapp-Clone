git checkout gh-pages
git merge master
call npm run build
ren build docs
git add .
git commit -m "Build"
git push -u origin gh-pages
git checkout master
pause
