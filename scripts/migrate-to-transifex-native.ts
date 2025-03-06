import transifex from "@api/transifex";

// Before running, install the transifex api: npx api install "@transifex/v1.0#a442qlw7q5q6u"
// also replace the following with an actual working api token
transifex.auth("");

const org = "sozialhelden";
const oldProject = "wheelmap-react-frontend";
const oldResource = "translationspot";
const newProject = "a11ymap";
const newResource = "a11ymap";

const orgId = `o:${org}`;
const oldProjectId = `${orgId}:p:${oldProject}`;
const newProjectId = `${orgId}:p:${newProject}`;
const oldResourceId = `${oldProjectId}:r:${oldResource}`;
const newResourceId = `${newProjectId}:r:${newResource}`;

function stop() {
  process.exit(0);
}

function getNextCursor(response) {
  if (!response.data.links.next) {
    return undefined;
  }
  const url = new URL(response.data.links.next);
  return url.searchParams.get("page[cursor]") || undefined;
}

async function getLanguageIds(projectId: string) {
  const languages = await transifex.getProjectsProject_idLanguages({
    project_id: projectId,
  });
  return languages.data.data.map((language) => language.id);
}

type ResourceTranslation = {
  resourceStringId: string;
  translations: {
    one?: string;
    other: string;
  };
};
async function getResourceTranslations(
  resourceId: string,
  languageId: string,
  cursor?: string,
): Promise<ResourceTranslation[]> {
  const response = await transifex.getResource_translations({
    "filter[resource]": resourceId,
    "filter[language]": languageId,
    "page[cursor]": cursor,
  });
  const data = response.data.data
    .map((s) => {
      if (!s.attributes.strings) {
        return null;
      }
      return {
        resourceStringId: s.relationships.resource_string.data.id,
        translations: s.attributes.strings,
      };
    })
    .filter(Boolean) as ResourceTranslation[];
  const nextCursor = getNextCursor(response);
  if (!nextCursor) {
    return data;
  }
  return [
    ...data,
    ...(await getResourceTranslations(resourceId, languageId, nextCursor)),
  ];
}

async function getResourceStrings(resourceId: string, cursor?: string) {
  const response = await transifex.getResource_strings({
    "filter[resource]": resourceId,
    "page[cursor]": cursor,
  });
  const data = response.data.data.map(({ id, attributes: { key } }) => ({
    id,
    key,
  }));
  const nextCursor = getNextCursor(response);
  if (!nextCursor) {
    return data;
  }
  return [...data, ...(await getResourceStrings(resourceId, nextCursor))];
}

function escapeXml(string: string) {
  return string.replace("&", "&amp;");
}

function createTranslationUnit({
  key,
  translations,
}: {
  key: string;
  translations: {
    one?: string;
    other: string;
  };
}) {
  return `
            <trans-unit id="1" xml:space="preserve">
                <source>${escapeXml(key)}</source>
                <target>${escapeXml(translations.other)}</target>
            </trans-unit>
    `;
}

async function uploadTranslations({
  languageId,
  translationUnits,
  resourceId,
}: {
  languageId: string;
  translationUnits: string;
  resourceId: string;
}) {
  const locale = languageId.replace("l:", "");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
    <file datatype="plaintext" original="self" source-language="en" target-language="${locale}">
        <header>
            <sxmd:metadata xmlns:sxmd="urn:x-sap:mlt:xliff12:metadata:1.0" xmlns="urn:x-sap:mlt:tsmetadata:1.0">
                <object-name>whatever</object-name>
                <collection>whatever</collection>
                <domain>whatever</domain>
                <developer>whatever</developer>
                <description>whatever</description>
            </sxmd:metadata>
        </header>
        <body>
            ${translationUnits}
        </body>
    </file>
</xliff>`;
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

async function main() {
  const oldResourceStrings = await getResourceStrings(oldResourceId);
  const languages = await getLanguageIds(oldProjectId);
  await Promise.all(
    languages.map(async (languageId) => {
      const oldResourceTranslations = await getResourceTranslations(
        oldResourceId,
        languageId,
      );
      const newTranslations = await Promise.all(
        oldResourceTranslations.map(
          async ({ resourceStringId, translations }) => {
            const { key } = oldResourceStrings.find(
              ({ id }) => id === resourceStringId,
            );
            return { key, translations };
          },
        ),
      );

      console.info(`Uploading translations for language ${languageId}...`);
      await uploadTranslations({
        languageId,
        resourceId: newResourceId,
        translationUnits: newTranslations.map(createTranslationUnit).join("\n"),
      });
    }),
  );
}

main()
  .then(() => {})
  .catch((err) => console.error(err));
