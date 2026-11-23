import type { AccessibilityCloudImage } from "~/needs-refactoring/lib/model/ac/Feature";

export const maxImageSize = 1920;

/**
 * How often a failed image request is retried before giving up. The image
 * scaling service of accessibility.cloud regularly fails with 503 errors
 * (e.g. when scaling large originals takes too long), and usually succeeds
 * on a subsequent request.
 */
export const maxImageLoadRetries = 3;

/**
 * Exponential backoff for image load retries: 1s, 2s, 4s, ...
 *
 * @param attempt Zero-based number of the retry that is about to happen.
 */
export function getImageLoadRetryDelay(attempt: number): number {
  return 1000 * 2 ** attempt;
}

// Make sure the given width and height never exceed the actual size of the
// image as well as the maximum size the image server allows. Also when
// either width or height is provided and not both, set the other property
// based on the image dimensions. Both, width and height, are needed by the
// Next.js Image component in order for the placeholder to have the correct
// size.
export function getDimensions({
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

/**
 * Builds the URL of a scaled version of the given image on the
 * accessibility.cloud image scaling service.
 */
export function buildScaledImageUrl({
  baseUrl,
  image,
  requestedWidth,
  retry = 0,
  version,
}: {
  baseUrl: string;
  image: AccessibilityCloudImage;
  requestedWidth: number;
  /** Number of the current retry. Changes the URL so the browser requests the image again. */
  retry?: number;
  /** Optional cache buster. */
  version?: string;
}): string {
  const { width, height } = getDimensions({ requestedWidth, image });
  const angle = image.angle
    ? `&angle=${((image.angle % 360) + 360) % 360}`
    : "";
  // Keep the URL format of the first attempt stable (including the trailing
  // `&`), so already cached scaled images are reused by the CDN.
  const extraParams = [
    version ? `version=${version}` : "",
    retry > 0 ? `retry=${retry}` : "",
  ]
    .filter(Boolean)
    .join("&");
  return `${baseUrl}/images/scale/${image.imagePath}?fit=inside&fitw=${width}&fith=${height}${angle}&${extraParams}`;
}
