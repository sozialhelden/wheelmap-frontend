# setup environment
export NEW_SOURCE_PO=${NEW_SOURCE_PO:-'./public/i18n/en_US.txt'}
export NODE_ENV=development

# ensure i18n & src folder are clean
if [ -n "$(git status --porcelain src public/i18n)" ]
then
  echo "Your repo must be clean. Exiting."
  exit 1
fi

# build plugin
npm run babel \
  -f retranslate/babel-plugin-retranslate/.babelrc \
  retranslate/babel-plugin-retranslate/src/plugin.js \
  -o retranslate/babel-plugin-retranslate/dist-plugin.js

# if the babelrc stays in the root folder, it messes up webpack
mv retranslate/.babelrc .babelrc

# run plugin on test
npm run babel \
  -f .babelrc \
  src \
  --out-dir src

# move babelrc back
mv .babelrc retranslate/.babelrc


# build rewrite script
npm run babel \
  -f retranslate/rewrite-pos/.babelrc \
  retranslate/rewrite-pos/rewrite-pos.js \
  -o retranslate/rewrite-pos/dist-rewrite-pos.js

# run script
node retranslate/rewrite-pos/dist-rewrite-pos.js

# ignore all changes on non c-3po files
ag -L "ttag" src | (xargs git checkout -- || true)
