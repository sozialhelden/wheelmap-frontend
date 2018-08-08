# setup environment
export NEW_SOURCE_PO=${NEW_SOURCE_PO:-'./public/i18n/en_US.txt'}
export NODE_ENV=development

# ensure i18n folder is reset 
git checkout -- public/i18n/ src

# build rewrite script
yarn run babel \
  -f retranslate/rewrite-pos/.babelrc \
  retranslate/rewrite-pos/rewrite-pos.js \
  -o retranslate/rewrite-pos/dist-rewrite-pos.js

# run script
yarn node retranslate/rewrite-pos/dist-rewrite-pos.js

# build plugin
yarn run babel \
  -f retranslate/babel-plugin-retranslate/.babelrc \
  retranslate/babel-plugin-retranslate/src/plugin.js \
  -o retranslate/babel-plugin-retranslate/dist-plugin.js

mv retranslate/.babelrc .babelrc

# run plugin on test
yarn run babel \
  -f .babelrc \
  src \
  --out-dir src

mv .babelrc retranslate/.babelrc

# ignore all changes on non c-3po files
ag -L "c-3po" src | xargs git checkout --