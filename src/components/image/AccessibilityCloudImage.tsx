"use client";

import NextImage, { type ImageProps } from "next/image";
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useAccessibilityCloudApi from "~/hooks/useAccessibilityCloudApi";
import type { AccessibilityCloudImage as AccessibilityCloudImageType } from "~/needs-refactoring/lib/model/ac/Feature";
import {
  buildScaledImageUrl,
  getDimensions,
  getImageLoadRetryDelay,
  maxImageLoadRetries,
} from "./accessibilityCloudImageUrl";

const defaultPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAALdQTFRFSUdXRENRQD5MOzpGNzZCNDI+MTA6Li03Tk1eSkhYRURTQT9NPDtINTM/Ly44VFJkT01fS0lZPTtJODdDMjE7WldrVVNlUE5gTEpaRkRUQkBOOThENjRAX11xWlhsVlRmUU9hR0VVQkFPPjxKY2B2W1ltV1VnTUtbSEZWPz1LOjlFZmR6ZGF3YF5yUlBiTkxcQ0JQamh/Z2V7XFpuWFZpU1Fja2iAZWJ4YV90XVtvWVZqaGZ8Yl91mUdXUwAAAFRJREFUeJwlizEOgDAMA3NDaWBhYmRjY2Lh/39A/UvTgkSiWpF8cmyEIRE0vM6mxgpGpuXGxoip7AOcOEz9G8cZgRKzi8YEjxfuTvJ6MUfpy5s+Cj/HsBrE/+Bj1QAAAABJRU5ErkJggg==";

export default function AccessibilityCloudImage({
  image,
  width: requestedWidth,
  height: requestedHeight,
  fill,
  forceReload,
  onError,
  ...props
}: Omit<ImageProps, "src" | "width" | "height"> & {
  width?: number;
  height?: number;
  image: AccessibilityCloudImageType;
  forceReload?: boolean; // Useful for testing. Will force a reload of the image from the server on every rerender
}) {
  const { baseUrl } = useAccessibilityCloudApi({ cached: true });

  const version = forceReload ? Math.random().toString().slice(2) : undefined;

  // The image scaling service sometimes fails (e.g. with 503 errors when
  // scaling a large original takes too long). Retry loading the image a few
  // times with an exponential backoff before giving up.
  const [retry, setRetry] = useState(0);
  const retryTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Reset retries when the image changes.
  useEffect(() => {
    setRetry(0);
    return () => clearTimeout(retryTimeout.current);
  }, [image.imagePath]);

  const handleError = useCallback(
    (event: SyntheticEvent<HTMLImageElement, Event>) => {
      if (retry < maxImageLoadRetries) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = setTimeout(
          () => setRetry((current) => current + 1),
          getImageLoadRetryDelay(retry),
        );
        return;
      }
      onError?.(event);
    },
    [retry, onError],
  );

  const { width, height } = useMemo(
    () => getDimensions({ requestedWidth, requestedHeight, image, fill }),
    [requestedWidth, requestedHeight, fill, image],
  );

  const acImageLoader = useCallback(
    ({ width: requestedWidth }: { src: string; width: number }) =>
      buildScaledImageUrl({
        baseUrl,
        image,
        requestedWidth,
        retry,
        version,
      }),
    [baseUrl, image, retry, version],
  );

  return (
    <NextImage
      {...{ ...props, width, height, fill }}
      // `src` has to change on every retry, otherwise Next.js does not
      // re-render the `<img>` element with the new URLs from the loader.
      src={`${image.imagePath}?retry=${retry}`}
      placeholder={"blur"}
      loader={acImageLoader}
      onError={handleError}
      blurDataURL={image.placeholder ?? defaultPlaceholder}
    />
  );
}
