/*
Simple Playwright stubs for geolocation. We inject via page.addInitScript so
navigator.geolocation is overridden before the app loads, making the dialog
flows deterministic without showing the native permission prompt. Error
objects mimic the GeolocationPositionError shape (code + named constants) so
the onboarding hook can branch as if the browser had returned those states.

Note: addInitScript only runs before scripts on the next navigation; it does not
retroactively patch a page that has already loaded. This is why allowGeolocation,
denyGeolocation and timeoutGeolocation have to be called right at the beginning
of each test before navigating to the page.
*/
import type { Page } from "@playwright/test";

type Coords = { latitude: number; longitude: number; accuracy?: number };

const DEFAULT_COORDS: Coords = {
  latitude: 52.52,
  longitude: 13.405,
  accuracy: 5,
};

const buildPosition = (coords: Coords) => ({
  coords: {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy ?? 5,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
});

const buildError = (code: 1 | 2 | 3, message: string) => ({
  code,
  message,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
});

export async function allowGeolocation(
  page: Page,
  coords: Coords = DEFAULT_COORDS,
) {
  await page.context().grantPermissions(["geolocation"]);
  await page.context().setGeolocation(coords);

  const position = buildPosition(coords);
  await page.addInitScript(
    ({ position: pos }) => {
      navigator.geolocation.getCurrentPosition = (
        success: PositionCallback,
        _error?: PositionErrorCallback,
      ) => success(pos as GeolocationPosition);

      navigator.geolocation.watchPosition = (
        success: PositionCallback,
        _error?: PositionErrorCallback,
      ) => {
        success(pos as GeolocationPosition);
        return 1;
      };
    },
    { position },
  );
}

export async function denyGeolocation(page: Page) {
  const error = buildError(1, "User denied geolocation");

  await page.addInitScript(
    ({ error: err }) => {
      navigator.geolocation.getCurrentPosition = (
        _success: PositionCallback,
        errorCallback?: PositionErrorCallback,
      ) => errorCallback?.(err as GeolocationPositionError);

      navigator.geolocation.watchPosition = (
        _success: PositionCallback,
        errorCallback?: PositionErrorCallback,
      ) => {
        errorCallback?.(err as GeolocationPositionError);
        return 1;
      };
    },
    { error },
  );
}

export async function timeoutGeolocation(page: Page) {
  const error = buildError(3, "Geolocation timed out");
  await page.addInitScript(
    ({ error: err }) => {
      navigator.geolocation.getCurrentPosition = (
        _success: PositionCallback,
        errorCallback?: PositionErrorCallback,
      ) => errorCallback?.(err as GeolocationPositionError);

      navigator.geolocation.watchPosition = (
        _success: PositionCallback,
        errorCallback?: PositionErrorCallback,
      ) => {
        errorCallback?.(err as GeolocationPositionError);
        return 1;
      };
    },
    { error },
  );
}

export async function resultFromGeolocation(page: Page) {
  return await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve("ok"),
          () => resolve("error"),
        );
      }),
  );
}
