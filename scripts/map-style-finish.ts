/**
 * This script downloads the latest map styles from Mapbox Studio, replaces
 * the local styles with the downloaded ones, and deletes the temporary
 * styles in Mapbox Studio.
 */

import { consola } from "consola";

import { deleteStyle } from "./utils/mapbox-api";
import { getStylesFromConfig, resetConfig } from "./utils/mapbox-config";
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

  await deleteStyle(styles.bright);
  await deleteStyle(styles.dark);

  resetConfig();

  consola.success(
    "Local styles updated and temporary styles in mapbox studio deleted!",
  );
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
