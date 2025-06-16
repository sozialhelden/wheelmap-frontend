import {
  type AppState,
  type AppStateKey,
  config,
} from "~/modules/app-state/app-state";

const localStorageKey = "a11ymap-app-state";

export function persistAppState(state: AppState): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  const stateToPersist = Object.entries(config).reduce(
    (acc, [key, { persist }]) => {
      return Object.assign(acc, {
        [key]: persist ? state[key as AppStateKey] : undefined,
      });
    },
    {} as Partial<AppState>,
  );
  localStorage.setItem(localStorageKey, JSON.stringify(stateToPersist));
}

export function getAppStateFromPersistence(): Partial<AppState> {
  if (typeof localStorage === "undefined") {
    return {};
  }
  const storedState = localStorage.getItem(localStorageKey);
  return storedState ? (JSON.parse(storedState) as AppState) : {};
}
