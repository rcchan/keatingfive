rm -r build/* build/.*
grunt
rsync -rLkpEtzPc /web/keating5/build/ rchan@keating:~/web
