import { join } from "node:path";
import { getStyle } from "./mapbox-api";
import { writeFile, unlink } from "node:fs/promises";

const styleFolder = join(
  __dirname,
  "..",
  "..",
  "src",
  "modules",
  "map",
  "styles",
);
const brightStylePath = join(styleFolder, "bright.json");
const darkStylePath = join(styleFolder, "dark.json");

export async function downloadBrightStyle(styleId: string) {
  const brightStyle = await getStyle(styleId);
  await unlink(brightStylePath);
  await writeFile(brightStylePath, JSON.stringify(brightStyle, null, 2));
}

export async function downloadDarkStyle(styleId: string) {
  const darkStyle = await getStyle(styleId);
  await unlink(darkStylePath);
  await writeFile(darkStylePath, JSON.stringify(darkStyle, null, 2));
}
