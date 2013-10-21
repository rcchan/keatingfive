shopt -s dotglob
rm -r build/*
shopt -u dotglob
grunt
rsync -rLkpEtzPc --delete-delay /web/keating5/build/ rchan@keating:~/web
