import { join } from "node:path";
import { getStyle } from "./mapbox-api";
import { writeFileSync } from "node:fs";

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
  writeFileSync(brightStylePath, JSON.stringify(brightStyle, null, 2));
}

export async function downloadDarkStyle(styleId: string) {
  const darkStyle = await getStyle(styleId);
  writeFileSync(darkStylePath, JSON.stringify(darkStyle, null, 2));
}
