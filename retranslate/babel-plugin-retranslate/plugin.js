"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return rootVisitor;
};

var _babylon = require("babylon");

var babylon = _interopRequireWildcard(_babylon);

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _gettextParser = require("gettext-parser");

var _gettextParser2 = _interopRequireDefault(_gettextParser);

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var parseOptions = {
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  preserveComments: false
};

let parsedGettext = null;
let lookupCache = {};

function fetchTranslationForTemplate(fetchKey, path) {
  if (!parsedGettext) {
    // load po file and store in lookup
    var content = fs.readFileSync(path);
    parsedGettext = _gettextParser2.default.po.parse(content);
    var translations = parsedGettext.translations[''];
    for (const key in translations) {
      // remove spaces around variables eg. ${ count }
      const cleanedKey = key.replace(/(\$\{\s+)/g, "${").replace(/(\s+})/g, "}");
      lookupCache[cleanedKey] = translations[key];
    }
  }

  return lookupCache[fetchKey];
}

function generateCodeFromTemplateAst(ast) {
  const generated = (0, _babelGenerator2.default)(ast);
  const code = generated.code;
  // remove ` ` around code 
  return code.substr(1, code.length - 2);
}

// build an ast from a string
function generateAstFromTemplateString(input) {
  var parsed = babylon.parse(`\`${input}\``, parseOptions);
  var ast = _babelTraverse2.default.removeProperties(parsed, { preserveComments: parseOptions.preserveComments });
  return ast.program.body[0].expression;
}

// go trough the source and replace any t`` occurrences
const rootVisitor = {
  visitor: {
    TaggedTemplateExpression(path, state) {
      const name = path.node.tag.name;

      // its a TaggedTemplateExpression with the name t
      if (name === 't') {
        // convert current ast path into something more easily compared
        const currentEntry = generateCodeFromTemplateAst(path.node.quasi);
        // fetch the translation for the entry
        const translation = fetchTranslationForTemplate(currentEntry, state.opts.replacement);

        if (translation) {
          // take the first translation and generate the ast from it
          var newQuasis = generateAstFromTemplateString(translation.msgstr[0]);
          // override original value
          path.node.quasi = newQuasis;
        } else {
          console.warn(`Could not find translation for \`${currentEntry}\`. Ensure your po files are up-to-date and that they contain all strings.`);
        }
      }
    }
  }
};
