# build plugin
yarn run babel \
  -f retranslate/babel-plugin-retranslate/.babelrc \
  retranslate/babel-plugin-retranslate/src/plugin.js \
  -o retranslate/babel-plugin-retranslate/dist-plugin.js

export NEW_SOURCE_PO=${NEW_SOURCE_PO:-'./public/i18n/en_US.txt'}

# run plugin on test
yarn run babel \
  -f retranslate/.babelrc \
  retranslate/test.js