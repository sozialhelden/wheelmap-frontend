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
    "When done editing in mapbox studio, run `npm run map:finish` to download the changes! ⬇️",
  );
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
