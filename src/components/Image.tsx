"use client";

import NextImage, { type ImageProps } from "next/image";
import { useCallback, useMemo } from "react";
import useAccessibilityCloudAPI from "~/lib/fetchers/ac/useAccessibilityCloudAPI";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";

const maxImageSize = 1920;
const defaultPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAALdQTFRFSUdXRENRQD5MOzpGNzZCNDI+MTA6Li03Tk1eSkhYRURTQT9NPDtINTM/Ly44VFJkT01fS0lZPTtJODdDMjE7WldrVVNlUE5gTEpaRkRUQkBOOThENjRAX11xWlhsVlRmUU9hR0VVQkFPPjxKY2B2W1ltV1VnTUtbSEZWPz1LOjlFZmR6ZGF3YF5yUlBiTkxcQ0JQamh/Z2V7XFpuWFZpU1Fja2iAZWJ4YV90XVtvWVZqaGZ8Yl91mUdXUwAAAFRJREFUeJwlizEOgDAMA3NDaWBhYmRjY2Lh/39A/UvTgkSiWpF8cmyEIRE0vM6mxgpGpuXGxoip7AOcOEz9G8cZgRKzi8YEjxfuTvJ6MUfpy5s+Cj/HsBrE/+Bj1QAAAABJRU5ErkJggg==";

// Make sure the given width and height never exceed the actual size of the
// image as well as the maximum size the image server allows. Also when
// either width or height is provided and not both, set the other property
// based on the image dimensions. Both, width and height, are needed by the
// Next.js Image component in order for the placeholder to have the correct
// size.
function getDimensions({
  image,
  requestedWidth,
  requestedHeight,
  fill,
}: {
  image: AccessibilityCloudImage;
  requestedWidth?: number;
  requestedHeight?: number;
  fill?: boolean;
}): { width?: number; height?: number } {
  const aspectRatio = image.dimensions.height / image.dimensions.width;
  const maxHeight = Math.min(image.dimensions.height, maxImageSize);
  const maxWidth = Math.min(image.dimensions.width, maxImageSize);
  let width = requestedWidth;
  let height = requestedHeight;
  if (requestedWidth && !requestedHeight && !fill) {
    width = Math.min(requestedWidth, image.dimensions.width, maxImageSize);
    height = Math.round(width * aspectRatio);
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round(maxHeight / aspectRatio);
    }
  }
  if (requestedHeight && !requestedWidth && !fill) {
    height = Math.min(requestedHeight, image.dimensions.height, maxImageSize);
    width = Math.round(height / aspectRatio);
    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(maxWidth * aspectRatio);
    }
  }
  return { width, height };
}

export default function Image({
  image,
  width: requestedWidth,
  height: requestedHeight,
  fill,
  forceReload,
  ...props
}: Omit<ImageProps, "src"> & {
  image: AccessibilityCloudImage;
  forceReload?: boolean; // Useful for testing. Will force a reload of the image from the server on every rerender
}) {
  const { baseUrl } = useAccessibilityCloudAPI({ cached: true });

  const additionalQueryParameter = forceReload
    ? `version=${Math.random().toString().slice(2)}`
    : "";

  const { width, height } = useMemo(
    () => getDimensions({ requestedWidth, requestedHeight, image, fill }),
    [requestedWidth, requestedHeight, fill, image],
  );

  const acImageLoader = useCallback(
    ({ src, width: requestedWidth }) => {
      const angle = image.angle
        ? `&angle=${((image.angle % 360) + 360) % 360}`
        : "";
      const { width, height } = getDimensions({ requestedWidth, image });
      return `${baseUrl}/images/scale/${src.replace("?", "")}?fit=inside&fitw=${width}&fith=${height}${angle}&${additionalQueryParameter}`;
    },
    [baseUrl, image, additionalQueryParameter],
  );

  return (
    <NextImage
      {...{ ...props, width, height, fill }}
      src={`${image.imagePath}?${additionalQueryParameter}`}
      placeholder={"blur"}
      loader={acImageLoader}
      blurDataURL={image.placeholder ?? defaultPlaceholder}
    />
  );
}
