import { parseCategoryQueryParameter } from "~/modules/categories/utils/state";
import {
  parseLegacyMapPositionQueryParameter,
  parseMapPositionQueryParameter,
  serializeMapPosition,
} from "~/modules/map/utils/state";
import {
  parseLegacyNeedQueryParameters,
  parseNeedQueryParameter,
} from "~/modules/needs/utils/state";
import {
  parseLegacySearchQueryParameter,
  parseSearchQueryParameter,
} from "~/modules/search/utils/state";
import type { NestedRecord } from "~/utils/search-params";

// App state is global state, that is entirely controlled by query parameters.
// So page reloads give identical results and users can link to certain parts
// of the app. Parts of the app state can also be persisted to local storage
// and restored on page load if not present in the URL.
const appStateConfig = {
  needs: {
    parser: parseNeedQueryParameter,
    legacy: parseLegacyNeedQueryParameters,
    persist: true,
  },
  position: {
    parser: parseMapPositionQueryParameter,
    legacy: parseLegacyMapPositionQueryParameter,
    serializer: serializeMapPosition,
    defaultValue: {
      latitude: 52.5,
      longitude: 13.3,
      zoom: 10,
    },
    persist: true,
  },
  search: {
    parser: parseSearchQueryParameter,
    legacy: parseLegacySearchQueryParameter,
  },
  category: {
    parser: parseCategoryQueryParameter,
  },
} as const;

export type AppStateKey = keyof typeof appStateConfig;
export type AppState = {
  [key in AppStateKey]: ReturnType<(typeof appStateConfig)[key]["parser"]>;
};

export type Query = NestedRecord<string | undefined>;
export type QueryParameterValue =
  | NestedRecord<string | undefined>
  | string
  | undefined;

// As we are using a const assertion to infer types from the config object,
// this essentially checks that the config object is valid itself. Any type
// errors on the config object will result in a type error here.
export const config: {
  [key in AppStateKey]: {
    // A parser function that is given the value of the query parameter
    // for the corresponding key and returns the parsed value.
    parser: (queryParameterValue: QueryParameterValue) => AppState[key];

    // An optional legacy parser function that is used to parse the entire
    // query and return the value for the corresponding key from legacy
    // query parameters.
    legacy?: (
      query: NestedRecord<string | undefined>,
    ) => AppState[key] | undefined;

    // Set a static default value for this app state, which is used when
    // there is no persisted value and no query parameter.
    defaultValue?: AppState[key];

    // An optional serializer function that will be used if present to
    // serialize the app state value into either a string or a nested
    // record of strings.
    serializer?: (appStateValue: AppState[key]) => QueryParameterValue;

    // Whether to persist this part of the app state in local storage
    // and restore it on page load if not present in the URL.
    persist?: boolean;
  };
} = appStateConfig;
