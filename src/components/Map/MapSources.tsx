import { useMemo } from "react";
import * as React from "react";
import { Source } from "react-map-gl/mapbox";
import { categories } from "~/domains/categories/categories";
import { useEnvContext } from "../../lib/context/EnvContext";
import type { YesNoLimitedUnknown } from "../../lib/model/ac/Feature";
import { useAppStateAwareRouter } from "../../lib/util/useAppStateAwareRouter";
import { databaseTableNames } from "./filterLayers";

const mapWheelchairFilter = (wheelchair: YesNoLimitedUnknown[]): string => {
  if (wheelchair.includes("no")) {
    return "no";
  }

  if (wheelchair.includes("unknown")) {
    return "unknown";
  }

  const limited = wheelchair.includes("limited");
  const yes = wheelchair.includes("yes");
  if (limited && yes) {
    return "yes;limited";
  }

  if (limited) {
    return "limited";
  }

  if (yes) {
    return "yes";
  }

  return "all";
};

export const MapSources = () => {
  const {
    searchParams: { wheelchair, toilet, category },
  } = useAppStateAwareRouter();

  const { NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL: tileBackendUrl } =
    useEnvContext();

  const mvtParams = useMemo(() => {
    const baseParams = new URLSearchParams({
      limit: "10000",
      epsg: "3857",
    });

    if (wheelchair && wheelchair.length > 0) {
      baseParams.set("wheelchair", mapWheelchairFilter(wheelchair));
    }

    if (toilet && toilet.length > 0 && toilet.includes("yes")) {
      baseParams.set("hasAccessibleToilet", "yes");
    }

    if (category) {
      const categoryEntry = categories[category];
      if (categoryEntry) {
        if (categoryEntry.applyCustomSearchParams) {
          categoryEntry?.applyCustomSearchParams(baseParams);
        } else {
          baseParams.set("category", category);
        }
      }
    }

    // {bbox-epsg-3857} is a placeholder for the bbox parameter that is filled in by the mapbox-gl library
    return `${baseParams.toString()}&bbox={bbox-epsg-3857}`;
  }, [category, toilet, wheelchair]);

  return (
    <>
      {databaseTableNames.map((name) => (
        <Source
          type="vector"
          tiles={[0, 1, 2, 3].map(
            (n) =>
              `${tileBackendUrl?.replace(
                /{n}/,
                n.toString(),
              )}/${name}.mvt?${mvtParams}`,
          )}
          id={name}
          key={name}
        />
      ))}
    </>
  );
};
