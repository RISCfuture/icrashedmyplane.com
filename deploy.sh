pushd deploy || exit
git fetch
git reset --hard origin/gh-pages
popd || exit

yarn build
rsync -rv --delete --exclude=".git" --force dist/ deploy/

pushd deploy || exit
git add -A
git commit -m "Deploy by $USER"
git push
popd || exit
