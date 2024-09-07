import { AccessibilityCloudTypeMapping } from "../typing/AccessibilityCloudTypeMapping";
import { HasTypeTag } from "../typing/TypeTaggedWithId";


export async function fetchWithTypeTag<S extends keyof AccessibilityCloudTypeMapping>(
  typeName: S,
  url: string
): Promise<AccessibilityCloudTypeMapping[S] & HasTypeTag<S>> {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Failed to fetch \`${typeName}\` (${r.status} ${r.statusText}) from ${url}`);
  }
  const json = await r.json();
  return { '@type': typeName, ...json };
}
