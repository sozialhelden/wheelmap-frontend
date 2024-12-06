import type { AccessibilityCloudRDFId } from "../brands/accessibilityCloudIds";
import { accessibilityCloudIdRegExp } from "../discriminators/isAccessibilityCloudId";

export function normalizeAccessibilityCloudId(id: string): AccessibilityCloudRDFId {
  const [, type, foundId] = id.match(accessibilityCloudIdRegExp) ?? [undefined, undefined];
  if (!type || !foundId) {
    throw new Error(`Could not normalize AccessibilityCloudId: ${id}`);
  }
  return `${type}/${foundId}` as AccessibilityCloudRDFId;
}
