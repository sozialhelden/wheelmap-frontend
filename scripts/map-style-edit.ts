/**
 * This script starts an editing process of map styles, by creating temporary
 * styles on Mapbox Studio based on the current configuration.
 */

import { consola } from "consola";
import { account } from "./utils/mapbox-api";
import { getStylesFromConfig } from "./utils/mapbox-config";

async function main() {
  const styles = await getStylesFromConfig();

  consola.box(
    `Bright ☀️\nhttps://console.mapbox.com/studio/styles/${account}/${styles.bright}/edit\n\nDark 🌙\nhttps://console.mapbox.com/studio/styles/${account}/${styles.dark}/edit`,
  );
  consola.info(
    "Run `npm run map:style:update` to upload your local changes to mapbox studio! ⬆️",
  );
  consola.info(
    "When done editing in mapbox studio, run `npm run map:style:finish` to download the changes! ⬇️",
  );
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
