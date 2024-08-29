import { uniq } from "lodash";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MapboxGeoJSONFeature, ViewState } from "react-map-gl";

export type RelevantViewState = Omit<
  ViewState,
  "bearing" | "pitch" | "padding"
>;
export interface MapOptions {
  viewState: Partial<RelevantViewState>;
  /** low priority updates the route, but does **not** update the map */
  lowPriority?: boolean;
  features?: MapboxGeoJSONFeature[];
}

const getFeatureUrl = (features: MapboxGeoJSONFeature[] | undefined) => {
  if (!features) {
    return "/";
  }

  const cleanFeatures = uniq(features.filter((x) => !!x));
  if (cleanFeatures.length <= 0) {
    return "/";
  }

  if (features.length === 1) {
    const feature = features[0];
    return `/${feature.source}/${feature.properties.id?.replace("/", ":")}`;
  }
  const featureString = features
    .map((f) => [f.source, f.properties.id?.replace("/", ":")].join(":"))
    .join(",");
  return `/composite/${featureString}`;
};

export const useMap = () => {
  const router = useRouter();

  return useCallback(
    (opts: MapOptions, overwrite: boolean = false) => {
      // excluding padding for now
      const { features = [], viewState, lowPriority } = opts;
      const { latitude, longitude, zoom } = viewState;

      const basepath = getFeatureUrl(features);

      const {
        lat: fallbackLat,
        lon: fallbackLon,
        zoom: fallBackZoom,
      } = router.query;

      let components = {
        lat: latitude ?? fallbackLat,
        lon: longitude ?? fallbackLon,
        zoom: zoom ?? fallBackZoom,
      };
      const lowPriorityFlake = lowPriority ? { lp: true } : undefined;
      console.log(`path: ${basepath}`);
      router.replace({
        pathname: basepath,
        query: { ...router.query, ...components, ...lowPriorityFlake },
      });
    },
    [router]
  );
};

const parseFirst = (value: string | string[]) => {
  if (typeof value === "object") {
    return undefined;
  }
  const numeric = parseFloat(value);
  if (isNaN(numeric)) {
    return undefined;
  }
  return numeric;
};
type ControlMode = "unlocked" | "exclusive";
interface Viewport {
  width: number;
  height: number;
}
const parseViewState = (
  controlMode: ControlMode,
  query: ParsedUrlQuery,
  viewState:
    | Partial<Omit<ViewState, "bearing" | "pitch" | "padding">>
    | undefined
): RelevantViewState | undefined => {
  if (controlMode !== "unlocked") {
    return;
  }

  const { lon, lat, zoom, lp } = query;

  if (!lat || !lon) {
    return;
  }

  // maybe poor design - the lp flag in a query can be set so that the map does not change location
  // but only so, if there exists a viewState - for example when initially setting up the map, there's no state
  if (lp && viewState) {
    return;
  }
  const parsedViewState: Partial<RelevantViewState> = {
    latitude: parseFirst(lat),
    longitude: parseFirst(lon),
    zoom: parseFirst(zoom),
  };

  return {
    ...viewState,
    latitude: parsedViewState.latitude ?? viewState.latitude,
    longitude: parsedViewState.longitude ?? viewState.longitude,
    zoom: parsedViewState.zoom ?? viewState.zoom,
  };
};

export const useMapState = (initialViewport?: Viewport) => {
  const { query } = useRouter();

  const [controlMode, setControlMode] = useState<ControlMode>("unlocked");
  const [viewState, setViewState] = useState<ViewState & Viewport>(() => {
    const initialState =
      parseViewState(controlMode, query, undefined) ??
      ({} as Partial<ViewState>);

    console.log(initialState);
    return {
      ...initialState,
      latitude: initialState.latitude ?? 52.5162,
      longitude: initialState.longitude ?? 13.37857,
      zoom: initialState.zoom ?? 11,
      pitch: 0,
      bearing: 0,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      width: initialViewport.width ?? 100,
      height: initialViewport.height ?? 100,
    };
  });

  useEffect(() => {
    const newState = parseViewState(controlMode, query, viewState);
    if (!newState) {
      return;
    }
    if (
      newState.latitude !== viewState.latitude ||
      newState.longitude !== viewState.longitude ||
      newState.zoom !== viewState.zoom
    ) {
      setViewState({ ...viewState, ...newState });
    }
  }, [query]);

  return {
    controlMode,
    setExclusiveControlMode: () => setControlMode("exclusive"),
    setUnlockedControlMode: () => setControlMode("unlocked"),

    viewState,
    setViewState: (val: Partial<ViewState>) => {
      setViewState({
        ...viewState,
        ...val,
      });
    },

    setViewport: (val: Viewport) => {
      setViewState({
        ...viewState,
        ...val,
      });
    },
  };
};
