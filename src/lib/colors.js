// @flow

import reduce from 'lodash/reduce';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import type { NodeProperties, YesNoLimitedUnknown } from './Feature';
import { isWheelchairAccessible } from './Feature';

// A bit more shiny:
// const colors = {
//   primaryColor: '#435D75',
//   secondaryColor: '#8B6A43',
//   linkColor: '#1fabd9',
//   highlightColor: '#435D75',
//   colorizedBackgroundColor: '#fbfaf9',
//   neutralBackgroundColor: '#F5F5F5',
//   selectedColor: '#1fabd9',
//   tonedDownSelectedColor: '#7c9198',
//   darkSelectedColor: '#04536d',
//   positiveColor: '#00b773',
//   warningColor: '#ff8d00',
//   negativeColor: '#f54b4b',
//   markerBackground: {
//     green: 'rgba(0, 183, 115, 1.0)',
//     yellow: 'rgba(255, 141, 0, 1.0)',
//     red: 'rgba(245, 75, 75, 1.0)',
//     gray: 'rgba(220, 217, 214, 0.9)',
//   },
// };

const colors = {
  primaryColor: '#79B63E',
  secondaryColor: '#8B6A43',
  darkLinkColor: '#455668',
  linkColor: '#2e6ce0',
  linkBackgroundColor: 'rgb(218, 241, 255)',
  linkBackgroundColorTransparent: 'rgba(0, 161, 255, 0.1)',
  highlightColor: '#435D75',
  colorizedBackgroundColor: '#fbfaf9',
  neutralBackgroundColor: '#eaeaea',
  selectedColor: '#51a6ff',
  tonedDownSelectedColor: '#89939e',
  darkSelectedColor: '#04536d',
  positiveColor: 'rgb(126, 197, 18)',
  positiveBackgroundColorTransparent: 'rgba(126, 197, 18, 0.1)',
  warningColor: 'rgb(243, 158, 59)',
  warningBackgroundColorTransparent: 'rgba(243, 158, 59, 0.1)',
  negativeColor: 'rgb(245, 75, 75)',
  negativeBackgroundColorTransparent: 'rgba(245, 75, 75, 0.1)',
  neutralColor: 'rgb(88, 87, 83)',
  neutralBackgroundColorTransparent: 'rgba(88, 87, 83, 0.11)',
  markerBackground: {
    green: '#7ec512',
    yellow: '#f39e3b',
    red: '#f54b4b',
    gray: '#e6e4e0',
  },
};

export type MarkerColor = 'red' | 'yellow' | 'green' | 'gray';
export const markerColors: MarkerColor[] = ['red', 'yellow', 'green', 'gray'];


export function getColorForWheelchairAccessibilityValue(
  isAccessible: YesNoLimitedUnknown,
): MarkerColor {
  switch (isAccessible) {
    case 'yes': return 'green';
    case 'limited': return 'yellow';
    case 'no': return 'red';
    default: return 'gray';
  }
}


export function getHTMLColorForWheelchairAccessibilityValue(
  isAccessible: YesNoLimitedUnknown,
): MarkerColor {
  return colors.markerBackground[getColorForWheelchairAccessibilityValue(isAccessible)];
}


export function getColorForWheelchairAccessibility(properties: NodeProperties): MarkerColor {
  return getColorForWheelchairAccessibilityValue(isWheelchairAccessible(properties));
}


const interpolateYellowGreen = interpolateLab(
  colors.markerBackground.yellow,
  colors.markerBackground.green,
);

const definedAccessibilityColorScale = scaleLinear().domain([0, 0.2, 0.4, 0.6, 0.8, 1]).range([
  colors.markerBackground.red,
  colors.markerBackground.yellow,
  interpolateYellowGreen(0.25),
  interpolateYellowGreen(0.5),
  interpolateYellowGreen(0.75),
  colors.markerBackground.green,
]);

export function interpolateWheelchairAccessibilityColors(propertiesArray: NodeProperties[]) {
  if (!propertiesArray || propertiesArray.length === 0) {
    return colors.markerBackground.gray;
  }
  const colorValues = propertiesArray.map(getColorForWheelchairAccessibility);
  const undefinedCount = colorValues.filter(c => c === 'gray').length;
  const definedCount = colorValues.length - undefinedCount;
  if (definedCount === 0) {
    return colors.markerBackground.gray;
  }
  const ratingForColor = color => ({ gray: 0, red: 0, yellow: 0.5, green: 1 }[color]);
  const reduceFn = (acc, color) => acc + ratingForColor(color);
  const totalRatingForDefined = reduce(colorValues, reduceFn, 0);
  const averageRatingForDefined = totalRatingForDefined / definedCount;
  const averageColorForDefined = definedAccessibilityColorScale(averageRatingForDefined);
  const definedRatio = definedCount / colorValues.length;
  // Don't take gray values into account that much
  const clampedDefinedRatio = Math.min(1.0, 0.5 + (definedRatio));
  return interpolateLab(colors.markerBackground.gray, averageColorForDefined)(clampedDefinedRatio);
}


export default colors;
