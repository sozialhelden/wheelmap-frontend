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
  width = 25,
  height = 25,
}: {
  map: MapboxMap;
  identifier: string;
  dataUri: string;
  width?: number;
  height?: number;
}): void {
  const pixelRatio = 2;
  const image = new Image(width * pixelRatio, height * pixelRatio);

  image.onload = () => {
    if (map.hasImage(identifier)) {
      map.removeImage(identifier);
    }
    map.addImage(identifier, image, { pixelRatio });
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

export async function loadIcons(
  map: MapBoxMap,
  renderedIcons: Record<string, string>,
): Promise<void> {
  const tasks: Array<() => void> = Object.entries(renderedIcons).map(
    ([identifier, dataUri]) =>
      () =>
        addImageToMapboxMap({
          map,
          identifier,
          dataUri,
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
