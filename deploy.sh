set -eo pipefail
shopt -s dotglob

rm -r build/* || true
shopt -u dotglob
grunt
if [[ "$1" != "--build" ]]; then
  rsync -rLkpEtzPc --delete-delay build/ rcchan@keating:~/web/
fi
