set -eo pipefail
shopt -s dotglob
rm -r build/* || true
shopt -u dotglob
grunt
rsync -rLkpEtzPc --delete-delay build/ rcchan@keating:~/web/
