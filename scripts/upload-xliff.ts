/*
 * This script allows you to upload xliff files to Transifex. It was originally
 * created to migrate from a file-based translation project to a Transifex Native
 * project. You can create xliff files from po files using the `po2xliff` command,
 * that's part of the translate toolkit:
 * http://docs.translatehouse.org/projects/translate-toolkit/en/latest/commands/xliff2po.html
 *
 * 1. Run `npm run transifex:install` and choose TypeScript. You need to discard
 *    the changes to the `package.json` and `package-lock.json` files afterwards.
 *    We don't want to include the Transifex API SDK in our project, as it is only
 *    used temporarily for this script.
 * 2. Make sure the `TRANSIFEX_API_TOKEN` environment variable is set and valid
 * 3. Run the script:
 *
 *    Upload a single xliff file:
 *    `npm run transifex:upload -- path/to/xliff/file.xliff "l:de_DE"`
 *
 *    Upload multiple xliff files at once:
 *   `npm run transifex:upload -- path/to/xliff/files`
 *
 * !Important notes:
 *
 * - "l:de_DE" is the language identifier in Transifex. When uploading a single file, replace
 *   it with the correct one.
 * - When uploading multiple files, the language id is inferred from the file name.
 *   So make sure your files are properly named. For example: `de.xliff` or `pt_BR.xliff`.
 */

// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { readFileSync, readdirSync } from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from "path";
import transifex from "@api/transifex";

if (!process.env.TRANSIFEX_API_TOKEN) {
  throw new Error("Please set the TRANSIFEX_API_TOKEN environment variable");
}

transifex.auth(process.env.TRANSIFEX_API_TOKEN);

const org = "sozialhelden";
const project = "a11ymap";
const resource = "a11ymap";

const orgId = `o:${org}`;
const projectId = `${orgId}:p:${project}`;
const resourceId = `${projectId}:r:${resource}`;

async function uploadTranslations({
  languageId,
  xml,
}: {
  languageId: string;
  xml: string;
}) {
  const data = {
    data: {
      type: "resource_translations_async_uploads" as const,
      attributes: {
        content_encoding: "base64" as const,
        file_type: "xliff" as const,
        content: Buffer.from(xml).toString("base64"),
      },
      relationships: {
        language: {
          data: {
            type: "languages" as const,
            id: languageId,
          },
        },
        resource: {
          data: {
            type: "resources" as const,
            id: resourceId,
          },
        },
      },
    },
  };

  const response =
    await transifex.postResource_translations_async_uploads(data);

  // wait for the upload to finish processing
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const statusResponse =
    await transifex.getResource_translations_async_uploadsResource_translations_async_upload_id(
      { resource_translations_async_upload_id: response.data.data.id },
    );

  if (statusResponse.data.data.attributes.status !== "succeeded") {
    throw new Error(
      `Upload failed for ${response.data.data.id}: ${JSON.stringify(statusResponse.data.data.attributes.errors, null, 2)}`,
    );
  }
}

async function uploadXliffFile({
  filePath,
  languageId,
}: { filePath: string; languageId?: string }) {
  const xml = String(readFileSync(filePath)).replace(
    `source-language="en-US"`,
    `source-language="en"`,
  );
  if (!languageId) {
    languageId = `l:${filePath.split("/")?.pop()?.split(".").shift()}`;
  }
  console.info(`Uploading ${languageId}`);
  await uploadTranslations({ languageId, xml });
  console.info(`${languageId} successfully uploaded!`);
}

async function main() {
  const input = process.argv[2];
  const languageId = process.argv[3];

  if (input.endsWith(".xliff")) {
    await uploadXliffFile({ filePath: input, languageId });
    console.info("Finished! 🎉");
    return;
  }

  const files = readdirSync(input);
  for (const file of files) {
    if (!file.endsWith(".xliff")) {
      continue;
    }
    try {
      await uploadXliffFile({ filePath: join(input, file) });
      console.info();
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error, null, 2));
    }
  }
  console.info("Finished! 🎉");
}

main()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    console.error(JSON.stringify(error, null, 2));
  });
