import { useCurrentAppToken } from "~/lib/context/AppContext";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";

export type OsmApiProps = {
  tileNumber?: number;
  cached?: boolean;
};

export default function useOsmApi({
  tileNumber = 1,
  cached = false,
}: OsmApiProps = {}) {
  const env = useEnvironmentContext();
  const appToken = useCurrentAppToken();

  const baseUrl =
    cached || tileNumber
      ? env.NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL?.replace(
          /\{n\}/,
          String(tileNumber),
        )
      : env.NEXT_PUBLIC_OSM_API_BACKEND_URL;

  if (!baseUrl) {
    throw new Error(
      "OSM base url not set. Please set NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN and NEXT_PUBLIC_OSM_API_BACKEND_URL.",
    );
  }

  return { baseUrl, appToken };
}
