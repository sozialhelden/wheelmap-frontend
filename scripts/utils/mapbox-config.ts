import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { consola } from "consola";
import {
  brightStyleName,
  createStyle,
  darkStyleName,
  styleExists,
  uploadIcons,
} from "./mapbox-api";

import brightStyle from "../../src/modules/map/styles/bright.json";
import darkStyle from "../../src/modules/map/styles/dark.json";

const config = join(__dirname, "..", "..", ".mapbox");

export async function getStylesFromConfig() {
  const styles = {
    bright: undefined,
    dark: undefined,
  };

  if (existsSync(config)) {
    consola.info("`.mapbox` config file exists!");
    const { bright, dark } = JSON.parse(readFileSync(config, "utf-8"));

    styles.bright = bright;
    styles.dark = dark;

    if (styles.bright && !(await styleExists(styles.bright))) {
      consola.info("Locally configured bright style not found, removing it...");
      styles.bright = undefined;
    }
    if (styles.dark && !(await styleExists(styles.dark))) {
      consola.info("Locally configured dark style not found, removing it...");
      styles.dark = undefined;
    }
  }

  if (!styles.bright) {
    consola.info(
      "Bright development style not found in mapbox studio, creating...",
    );
    styles.bright = (await createStyle(brightStyleName, brightStyle)).id;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    await uploadIcons(styles.bright!, false);
  }
  if (!styles.dark) {
    consola.info(
      "Dark development style not found in mapbox studio, creating...",
    );
    styles.dark = (await createStyle(darkStyleName, darkStyle)).id;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    await uploadIcons(styles.dark!, true);
  }

  consola.info("Updating local `.mapbox` config file...");
  writeFileSync(config, JSON.stringify(styles, null, 2));

  return styles as unknown as { bright: string; dark: string };
}

export function resetConfig() {
  writeFileSync(
    config,
    JSON.stringify({ bright: undefined, dark: undefined }, null, 2),
  );
}
