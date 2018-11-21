set -eo pipefail
shopt -s dotglob

rm -r build/* || true
shopt -u dotglob
grunt
if [[ "$1" != "--build" ]]; then
  rsync -rLkpEtzPc --delete-delay --exclude /files/videos/ build/ rcchan@keating:~/web/
fi
