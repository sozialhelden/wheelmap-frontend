import { consola } from "consola";

import brightStyle from "../src/modules/map/styles/bright.json";
import darkStyle from "../src/modules/map/styles/dark.json";

import {
  brightStyleName,
  darkStyleName,
  updateStyle,
  uploadIcons,
} from "./utils/mapbox-api";
import { getStylesFromConfig } from "./utils/mapbox-config";

async function main() {
  const styles = await getStylesFromConfig();

  await consola.prompt(
    "This will overwrite all changes made in mapbox, continue?",
    {
      type: "confirm",
    },
  );

  consola.info("Updating remote styles to match the local ones...");
  await updateStyle(styles.bright, brightStyleName, brightStyle);
  await uploadIcons(styles.bright, false);
  await updateStyle(styles.dark, darkStyleName, darkStyle);
  await uploadIcons(styles.dark, true);
  consola.success("Styles updated, ready to go.");
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
