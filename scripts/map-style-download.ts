/**
 * This script downloads the latest map styles from Mapbox Studio and overrides
 * the local styles.
 */

import { consola } from "consola";

import { getStylesFromConfig } from "./utils/mapbox-config";
import { downloadBrightStyle, downloadDarkStyle } from "./utils/mapbox-styles";

async function main() {
  const styles = await getStylesFromConfig();

  await consola.prompt(
    "This will overwrite all changes made to the map styles locally, continue?",
    {
      type: "confirm",
    },
  );

  consola.info("Updating locale styles to match the remote ones...");

  await downloadBrightStyle(styles.bright);
  await downloadDarkStyle(styles.dark);

  consola.success("Local styles updated!");
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
