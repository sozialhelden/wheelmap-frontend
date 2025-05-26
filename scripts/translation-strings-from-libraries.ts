/**
 * This script generates a temporary file containing translation strings from
 * libraries used in the project, like @sozialhelden/core, so that the transifex
 * cli utilities can ingest the translation strings.
 */

import { getCategories } from "@sozialhelden/core";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const translationFile = join(
  __dirname,
  "..",
  "src",
  "external-translation-strings.ts",
);

async function main() {
  let output = "import { t } from '@transifex/native';\n\n";

  for (const [category, { name }] of Object.entries(getCategories())) {
    output += `const ${category} = t("${name()}");\n`;
  }

  await writeFile(translationFile, output);
}

main()
  .then(() => {
    console.log("Translation strings written to", translationFile);
  })
  .catch((error) => {
    console.error("Error generating translation strings:", error);
    process.exit(1);
  });
