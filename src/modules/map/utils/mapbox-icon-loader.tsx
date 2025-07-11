import type { Map as MapBoxMap, Map as MapboxMap } from "mapbox-gl";
import type { ReactNode } from "react";
import { icons } from "~/modules/map/icons";
import {
  getIconComponent,
  renderSvgAsDataUri,
} from "~/modules/map/utils/mapbox-icon-renderer";

const renderCache = new Map<string, string>();

export function addImageToMapboxMap({
  map,
  identifier,
  dataUri,
  width,
  height,
}: {
  map: MapboxMap;
  identifier: string;
  dataUri: string;
  width: number;
  height: number;
}): void {
  const addImageToMap = (image: HTMLImageElement) => {
    if (map.hasImage(identifier)) {
      map.removeImage(identifier);
    }
    map.addImage(identifier, image, { pixelRatio: 4 });
  };

  const image = new Image(width * 4, height * 4);

  image.onload = () => {
    addImageToMap(image);
  };

  image.onerror = (
    _event: Event | string,
    _source?: string,
    _lineno?: number,
    _colno?: number,
    error?: Error,
  ) => {
    console.error(`Could not add image ${identifier} to mapbox map:`, error);
  };

  image.src = dataUri;
}

export function addSvgIconToMapboxMap({
  map,
  identifier,
  icon,
  height,
  width = 25,
  darkMode,
}: {
  map: MapboxMap;
  identifier: string;
  icon: ReactNode;
  darkMode: boolean;
  width?: number;
  height?: number;
}): void {
  const cacheKey = `${identifier}-${darkMode ? "dark" : "light"}`;
  let dataUri = renderCache.get(cacheKey);

  try {
    dataUri = dataUri || renderSvgAsDataUri(icon);
    renderCache.set(cacheKey, dataUri);
  } catch (error) {
    console.error(`Could not add svg icon ${identifier} to mapbox map:`, error);
    return;
  }

  addImageToMapboxMap({
    map,
    identifier,
    dataUri,
    width,
    height: height || width,
  });
}

export async function loadIcons(
  map: MapBoxMap,
  darkMode: boolean,
): Promise<void> {
  const tasks: Array<() => void> = Object.entries(icons).map(
    ([identifier, icon]) =>
      () =>
        addSvgIconToMapboxMap({
          map,
          identifier,
          darkMode,
          icon: getIconComponent(icon, darkMode),
        }),
  );

  const batchSize = 20;

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    for (const task of batch) {
      task();
    }

    // Yield control to let the UI update. The `setTimeout()` call is necessary: Without
    // it, the following batch would be loaded in the same main loop iteration, which means the
    // browser would not get time for handling other events – the UI would get stuck. The
    // `setTimeout()` call means that processing the next batch happens asynchronously. This
    // way, the batch processing doesn't use **one**, but **multiple** JS main loop iterations.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
