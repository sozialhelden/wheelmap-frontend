yarn run babel -f retranslate/babel-plugin-retranslate/.babelrc retranslate/babel-plugin-retranslate/src/plugin.js -o retranslate/babel-plugin-retranslate/plugin.js 

yarn run babel -f retranslate/.babelrc retranslate/test.js

# https://stackoverflow.com/questions/5938869/how-to-generate-a-new-pot-template-from-a-translated-po-file