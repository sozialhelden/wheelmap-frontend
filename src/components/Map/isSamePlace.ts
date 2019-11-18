import includes from 'lodash/includes';
import levenshtein from 'fast-levenshtein';
import { translatedStringFromObject } from '../../lib/i18n';
import { NodeProperties } from '../../lib/Feature';

export default function isSamePlace(propertiesArray: NodeProperties[]) {
  const hasTwoPlaces = propertiesArray.length === 2;
  if (!hasTwoPlaces) return false;

  const [name0, name1] = propertiesArray.map(p => translatedStringFromObject(p.name));
  if (!name0 || !name1) return false;

  const levenshteinDistance = levenshtein.get(name0, name1, { useCollator: true });
  if (levenshteinDistance < 5) return true;

  const isOneStringContainedInTheOther = includes(name0, name1) || includes(name1, name0);
  return isOneStringContainedInTheOther;
}
