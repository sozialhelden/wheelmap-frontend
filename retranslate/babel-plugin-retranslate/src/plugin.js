
import * as babylon from "babylon";
import traverse from "babel-traverse";
import generate from "babel-generator";
import gettextParser from "gettext-parser";
import * as fs from "fs";



var parseOptions = {
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  preserveComments: false
};

let parsedGettext = null;
let lookupCache = {};

function fetchTranslationForTemplate(fetchKey, path) {
  if (!parsedGettext) {
    const pathFromEnv = process.env.NEW_SOURCE_PO || path;
    // load po file and store in lookup
    const content = fs.readFileSync(pathFromEnv);
    parsedGettext = gettextParser.po.parse(content);
    const translations = parsedGettext.translations[''];
    for (const key in translations) {
      // remove spaces around variables eg. ${ count }
      const cleanedKey = key.replace(/(\$\{\s+)/g, "${").replace(/(\s+})/g, "}");
      lookupCache[cleanedKey] = translations[key];
    }
  }

  return lookupCache[fetchKey];
}

function generateCodeFromTemplateAst(ast) {
  const generated = generate(ast);
  const code = generated.code;
  // remove ` ` around code 
  return code.substr(1, code.length - 2);
}

// build an ast from a string
function generateAstFromTemplateString(input) {
  var parsed = babylon.parse(`\`${input}\``, parseOptions);
  var ast = traverse.removeProperties(parsed, { preserveComments: parseOptions.preserveComments });
  return ast.program.body[0].expression;
}

// go trough the source and replace any t`` occurrences
const rootVisitor = {
    visitor: {
      TaggedTemplateExpression(path, state) {
        const name = path.node.tag.name;

        // it's a TaggedTemplateExpression with the name t
        if (name === 't') {
          // convert current ast path into something more easily compared
          const currentEntry = generateCodeFromTemplateAst(path.node.quasi);
          // fetch the translation for the entry
          const translation = fetchTranslationForTemplate(currentEntry, state.opts.replacement);

          if (translation) {
            // take the first translation and generate the ast from it
            const firstTranslation = translation.msgstr[0] || translation.msgid;
            if (!translation.msgstr[0]) {
              console.warn(`Could not find translation for \`${currentEntry}\`, using msgid instead.`);
            }
            const newQuasis = generateAstFromTemplateString(firstTranslation);
            // override original value
            path.node.quasi = newQuasis;
          } else {
            console.warn(`Could not find translation entry for \`${currentEntry}\`. Ensure your po files are up-to-date and that they contain all strings.`);
          }
        }
      }
    }
};

export default function () {
  return rootVisitor;
}