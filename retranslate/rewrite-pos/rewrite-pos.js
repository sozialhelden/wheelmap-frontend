
import gettextParser from "gettext-parser";
import * as fs from "fs";
import * as Path from 'path';

const newSourcePath = process.env.NEW_SOURCE_PO || './public/i18n/de.txt';
const inputFiles = process.env.PO_FILES || './public/i18n/';
const extensions = (process.env.PO_EXTENSIONS || '.po,.txt').split(',');

const newSourceContent = fs.readFileSync(newSourcePath);
const newSourcePo = gettextParser.po.parse(newSourceContent);

// takes two parsed po files & rewrites the ids of the first one based on the new sources translations
function replaceMsgidWithMsgstr(parsedPo, newSourcePo) {
  for (const contextKey in parsedPo.translations) {
      // handle invalid contexts
    if (!newSourcePo.translations[contextKey]) {
      console.error(`new source translation missing context '${contextKey}'`);
      continue;
    }
    const rewrittenContext = {};
    for (const key in parsedPo.translations[contextKey]) {
      // handle invalid strings
      if (!newSourcePo.translations[contextKey][key]) {
        console.error(`new source translation missing string '${key}'`);
        continue;
      }

      const rewriteValue = newSourcePo.translations[contextKey][key];
      const newValue = Object.assign({}, parsedPo.translations[contextKey][key]);
      // translate base
      if (rewriteValue.msgstr[0]) {
        const newKey = rewriteValue.msgstr[0];
        newValue.msgid = newKey;
        rewrittenContext[newKey] = newValue;
      } else {
        console.warn(`new source translation missing for '${newValue.msgid}'`);
        rewrittenContext[key] = newValue;
      }

      // retranslate plurals
      if (newValue.msgid_plural) {
        if (rewriteValue.msgstr[1]) {
          const newKey = rewriteValue.msgstr[1];
          newValue.msgid_plural = newKey;
        } else {
          console.warn(`new source plural translation missing for '${newValue.msgid_plural}'`);
        }
      }
    }
    parsedPo.translations[contextKey] = rewrittenContext;
  }
}

// read all files from po folder
const allPos = fs.readdirSync(inputFiles)
  .filter(
      item => fs.statSync(Path.join(inputFiles, item)).isFile() &&
          extensions.includes(Path.extname(item)))
  .sort();

// rewrite them all!
allPos.forEach(po => {
  const poPath = Path.join(inputFiles, po);
  const retranslateContent = fs.readFileSync(poPath);
  const retranslatePo = gettextParser.po.parse(retranslateContent);

  replaceMsgidWithMsgstr(retranslatePo, newSourcePo);
  var retranslateOutput = gettextParser.po.compile(retranslatePo);
  fs.writeFileSync(poPath, retranslateOutput);
});



