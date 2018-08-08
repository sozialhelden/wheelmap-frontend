# build plugin
yarn run babel \
  -f retranslate/babel-plugin-retranslate/.babelrc \
  retranslate/babel-plugin-retranslate/src/plugin.js \
  -o retranslate/babel-plugin-retranslate/plugin.js

export TARGET_POT=${TARGET_POT:-'./public/i18n/en_US.txt'}

# run plugin on test
yarn run babel \
  -f retranslate/.babelrc \
  retranslate/test.js