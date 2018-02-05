// @flow

import reduce from 'lodash/reduce';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import type { NodeProperties, YesNoLimitedUnknown } from './Feature';
import { isWheelchairAccessible } from './Feature';

const colors = {
  primaryColor: '#79B63E',
  primaryColorDarker: '#4d7227',
  secondaryColor: '#8B6A43',
  darkLinkColor: '#455668',
  linkColor: '#2e6ce0',
  textColor: '#111',
  linkColorDarker: '#2163de',
  linkBackgroundColor: 'rgb(218, 241, 255)',
  linkBackgroundColorTransparent: 'rgba(0, 161, 255, 0.1)',
  highlightColor: '#435D75',
  colorizedBackgroundColor: '#fbfaf9',
  neutralBackgroundColor: '#eaeaea',
  selectedColor: '#51a6ff',
  selectedColorLight: '#80bdff',
  tonedDownSelectedColor: '#89939e',
  darkSelectedColor: '#04536d',
  positiveColor: 'rgb(126, 197, 18)',
  positiveColorDarker: '#4d790b',
  positiveBackgroundColorTransparent: 'rgba(126, 197, 18, 0.1)',
  warningColor: 'rgb(243, 158, 59)',
  warningColorDarker: '#a85e0b',
  warningBackgroundColorTransparent: 'rgba(243, 158, 59, 0.1)',
  negativeColor: 'rgb(245, 75, 75)',
  negativeColorDarker: '#d40c0c',
  negativeBackgroundColorTransparent: 'rgba(245, 75, 75, 0.1)',
  neutralColor: 'rgb(88, 87, 83)',
  neutralBackgroundColorTransparent: 'rgba(88, 87, 83, 0.11)',
  markers: {
    background: {
      yes: '#7ec512',
      limited: '#f39e3b',
      no: '#f54b4b',
      unknown: '#e6e4e0',
    },
    foreground: {
      yes: '#fff',
      limited: '#fff',
      no: '#fff',
      unknown: '#69615b',
    },
  }
};


export function getHTMLColorForWheelchairAccessibilityValue(
  isAccessible: YesNoLimitedUnknown,
): string {
  return colors.markers.background[isAccessible];
}


export function getColorForWheelchairAccessibility(properties: NodeProperties): string {
  return isWheelchairAccessible(properties);
}


const interpolateYesLimited = interpolateLab(
  colors.markers.background.limited,
  colors.markers.background.yes,
);

const definedAccessibilityColorScale = scaleLinear().domain([0, 0.2, 0.4, 0.6, 0.8, 1]).range([
  colors.markers.background.no,
  colors.markers.background.limited,
  interpolateYesLimited(0.25),
  interpolateYesLimited(0.5),
  interpolateYesLimited(0.75),
  colors.markers.background.yes,
]);

export function interpolateWheelchairAccessibilityColors(propertiesArray: NodeProperties[]) {
  if (!propertiesArray || propertiesArray.length === 0) {
    return colors.markers.background.unknown;
  }
  const accessibilityValues = propertiesArray.map(isWheelchairAccessible);
  const undefinedCount = accessibilityValues.filter(c => c === 'unknown').length;
  const definedCount = accessibilityValues.length - undefinedCount;
  if (definedCount === 0) {
    return colors.markers.background.unknown;
  }
  const ratingForAccessibility = accessibility => ({ unknown: 0, no: 0, limited: 0.5, yes: 1 }[accessibility]);
  const reduceFn = (acc, accessibility) => acc + ratingForAccessibility(accessibility);
  const totalRatingForDefined = reduce(accessibilityValues, reduceFn, 0);
  const averageRatingForDefined = totalRatingForDefined / definedCount;
  const averageAccessibilityForDefined = definedAccessibilityColorScale(averageRatingForDefined);
  const definedRatio = definedCount / accessibilityValues.length;
  // Don't take unknown values into account that much
  const clampedDefinedRatio = Math.min(1.0, 0.5 + (definedRatio));
  return interpolateLab(colors.markers.background.unknown, averageAccessibilityForDefined)(clampedDefinedRatio);
}


export default colors;
