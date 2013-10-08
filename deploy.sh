rm -r build/* build/.*
grunt
rsync -rLkpEtzP /web/keating5/build/ rchan@keating:~/web
