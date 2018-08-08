
import gettextParser from "gettext-parser";
import * as fs from "fs";

// const originalPot = process.env.ORIGINAL_SOURCE_POT || './public/i18n/translations.pot';
const retranslateTarget = process.env.NEW_SOURCE_PO || './public/i18n/de.txt';
const inputDir = process.env.PO_FILES || './public/i18n/*.txt';

const retranslateContent = fs.readFileSync(retranslateTarget);
const retranslatePo = gettextParser.po.parse(retranslateContent);


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

      const newValue = Object.assign({}, newSourcePo.translations[contextKey][key]);
      // translate base
      if (newValue.msgstr[0]) {
        const newKey = newValue.msgstr[0];
        newValue.msgid = newKey;
        rewrittenContext[newKey] = newValue;
      } else {
        console.warn(`new source translation missing for '${newValue.msgid}'`);
        rewrittenContext[key] = newValue;
      }

      // retranslate plurals
      if (newValue.msgid_plural) {
        if (newValue.msgstr[1]) {
          const newKey = newValue.msgstr[1];
          newValue.msgid_plural = newKey;
        } else {
          console.warn(`new source plural translation missing for '${newValue.msgid_plural}'`);
        }
      }
    }
    parsedPo.translations[contextKey] = rewrittenContext;
  }
}

replaceMsgidWithMsgstr(retranslatePo, retranslatePo);


var retranslateOutput = gettextParser.po.compile(retranslatePo);
fs.writeFileSync('test.po', retranslateOutput);