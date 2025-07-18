import type { Point } from "geojson";
import type { GeoJSONFeature, TargetFeature } from "mapbox-gl";
import opening_hours from "opening_hours";
import { useI18n } from "~/modules/i18n/context/I18nContext";
import { useMap } from "~/modules/map/hooks/useMap";
import { useAdminAreas } from "~/needs-refactoring/lib/fetchers/osm-api/fetchAdminAreas";

export function useOpeningHours(
  feature: GeoJSONFeature,
): opening_hours | undefined {
  const { language } = useI18n();
  const { lat, lon } = useFeatureReferencePoint(feature);
  const address = useFeatureAddress(feature);

  if (!feature.properties?.opening_hours || !lat || !lon) {
    return undefined;
  }

  try {
    return new opening_hours(
      feature.properties.opening_hours,
      { lat, lon, address },
      {
        locale: language,
        tag_key: "opening_hours",
        map_value: true,
        mode: 2,
        warnings_severity: 6,
      },
    );
  } catch (e) {
    return undefined;
  }
}

function useFeatureReferencePoint(feature: GeoJSONFeature): {
  lat: number | undefined;
  lon: number | undefined;
} {
  const { map } = useMap();

  if ((feature as TargetFeature).tile) {
    // const { x, y, z } = (feature as TargetFeature).tile;
    // TODO: get real coordinates from the tile via mapbox tilebet
    // return {}
  }

  if ((feature?.geometry as Point)?.coordinates) {
    const [lon, lat] = (feature.geometry as Point).coordinates;
    return { lat, lon };
  }

  if (map) {
    const { lng, lat } = map.getCenter();
    return { lat, lon: lng };
  }

  return {
    lat: undefined,
    lon: undefined,
  };
}

function useFeatureAddress(feature: GeoJSONFeature): {
  country_code: string;
  state: string;
} {
  const { lat, lon } = useFeatureReferencePoint(feature);

  let country = feature.properties?.["addr:country"];
  let state = feature.properties?.["addr:state"];

  const addressDefined = country && state;

  const { featuresByType } = useAdminAreas({
    latitude: addressDefined ? undefined : lat,
    longitude: lon,
  });

  if (addressDefined) {
    return {
      country_code: country,
      state,
    };
  }

  if (!country) {
    country = String(
      featuresByType?.country?.properties?.["ISO3166-1:alpha2"] || "",
    );
  }
  if (!state) {
    state = (featuresByType?.state || featuresByType?.city)?.properties
      ?.state_code;
  }

  return {
    country_code: country,
    state,
  };
}
