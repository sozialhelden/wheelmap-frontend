import type { Map as MapboxMap, Map as MapBoxMap } from "mapbox-gl";
import { index } from "~/modules/map/icons";
import {
  getIconComponent,
  renderSvgAsDataUri,
} from "~/modules/map/utils/svg-renderer";
import type { ReactNode } from "react";

const imageCache = new Map<string, HTMLImageElement>();
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
      return;
    }
    map.addImage(identifier, image, { pixelRatio: 4 });
  };

  const imageFromCache = imageCache.get(identifier);

  if (imageFromCache) {
    addImageToMap(imageFromCache);
    return;
  }

  const image = new Image(width * 4, height * 4);

  image.onload = () => {
    imageCache.set(identifier, image);
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
}: {
  map: MapboxMap;
  identifier: string;
  icon: ReactNode;
  width?: number;
  height?: number;
}): void {
  let dataUri = renderCache.get(identifier);

  try {
    dataUri = dataUri || renderSvgAsDataUri(icon);
    renderCache.set(identifier, dataUri);
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

export async function loadIcons(map: MapBoxMap): Promise<void> {
  const tasks: Array<() => void> = Object.entries(index).map(
    ([identifier, icon]) =>
      () =>
        addSvgIconToMapboxMap({
          map,
          identifier,
          icon: getIconComponent(icon),
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
