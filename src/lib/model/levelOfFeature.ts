import get from 'lodash/get';
import { Feature } from '../Feature';
import { translatedStringFromObject } from '../i18n';

// Levels we can't order are shown after all known levels (sorted by name among each other).
export const UNKNOWN_LEVEL_SORT_KEY = Number.MAX_SAFE_INTEGER - 1;

// The API returns the address as `properties.address`, the database stores it as
// `properties.accessibility.address`, so we support both.
function getLevelAddressField(feature: Feature, field: 'levelName' | 'levelIndex') {
  return get(feature, ['properties', 'address', field]) ?? get(feature, ['properties', 'accessibility', 'address', field]);
}

export function getLevelName(feature: Feature): string | undefined {
  const levelName = translatedStringFromObject(getLevelAddressField(feature, 'levelName'));
  const trimmed = levelName && String(levelName).trim();
  // Add the ordinal dot to level names like "2 Obergeschoss" → "2. Obergeschoss"
  return trimmed ? trimmed.replace(/^(\d+)\s+(?=[A-Za-zÄÖÜäöü])/, '$1. ') : undefined;
}

function guessLevelIndexFromName(levelName: string): number {
  const name = levelName.toLowerCase();
  const leadingNumberMatch = name.match(/^(-?\d+(\.\d+)?)/);
  const leadingNumber = leadingNumberMatch ? parseFloat(leadingNumberMatch[1]) : null;

  if (/erdgeschoss|^eg\b|ground floor|parterre|^0$/.test(name)) {
    return 0;
  }
  if (/untergeschoss|^ug\b|keller|basement/.test(name)) {
    return leadingNumber !== null ? -Math.abs(leadingNumber) : -1;
  }
  if (leadingNumber !== null) {
    return leadingNumber;
  }
  return UNKNOWN_LEVEL_SORT_KEY;
}

// Uses A11yJSON's `levelIndex` when available (0 = ground floor), otherwise guesses from the level name.
export function getLevelSortKey(feature: Feature, levelName: string): number {
  const levelIndex = getLevelAddressField(feature, 'levelIndex');
  if (typeof levelIndex === 'number' && !isNaN(levelIndex)) {
    return levelIndex;
  }
  return guessLevelIndexFromName(levelName);
}
