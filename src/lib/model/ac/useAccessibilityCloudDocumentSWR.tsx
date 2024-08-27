import useSWR from 'swr';
import { useCurrentApp } from '../../context/AppContext';
import { useEnvContext } from '../../context/EnvContext';
import { memoizedKebapCase } from '../../util/strings/kebapCase';
import { AccessibilityCloudTypeMapping } from '../typing/AccessibilityCloudTypeMapping';
import { HasTypeTag } from '../typing/TypeTaggedWithId';
import { memoizedPluralize } from './pluralize';

export async function fetchWithTypeTag<S extends keyof AccessibilityCloudTypeMapping>(
  typeName: S,
  url: string,
): Promise<HasTypeTag<S>> {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Failed to fetch \`${typeName}\` (${r.status} ${r.statusText}) from ${url}`);
  }
  const json = await r.json();
  return { '@type': typeName, ...json };
}

export function useAccessibilityCloudDocumentSWR(typeName: keyof AccessibilityCloudTypeMapping, _id: string, cached: boolean = true) {
  const app = useCurrentApp();
  const env = useEnvContext();
  const appToken = app.tokenString;
  const baseUrl = cached ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const pluralModelName = memoizedPluralize(typeName);
  const kebapPluralModelName = memoizedKebapCase(pluralModelName);
  const url = `${baseUrl}/${kebapPluralModelName}/${_id}.json?appToken=${appToken}`;
  const canFetch = appToken && baseUrl && _id;
  return useSWR(canFetch ? [typeName, url] : null, fetchWithTypeTag);
}
