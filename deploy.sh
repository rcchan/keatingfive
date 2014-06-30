shopt -s dotglob
rm -r build/*
shopt -u dotglob
grunt
rsync -rLkpEtzPc --delete-delay /web/keatingfive/build/ rchan@keating:~/web
