// @flow

import get from 'lodash/get';
import type { NodeProperties } from './Feature';

const colors = {
  primaryColor: '#435D75',
  secondaryColor: '#8B6A43',
  linkColor: '#1fabd9',
  highlightColor: '#435D75',
  colorizedBackgroundColor: '#fbfaf9',
  neutralBackgroundColor: '#F5F5F5',
  selectedColor: '#1fabd9',
  tonedDownSelectedColor: '#7c9198',
  darkSelectedColor: '#04536d',
  positiveColor: '#00b773',
  warningColor: '#ff8d00',
  negativeColor: '#f54b4b',
};


export function getColorForWheelchairAccessiblity(properties: NodeProperties): string {
  const isAccessible = get(properties, 'wheelchair') ||
    get(properties, 'accessibility.accessibleWith.wheelchair');
  const isPartiallyAccessible = get(properties, 'accessibility.partiallyAccessibleWith.wheelchair');
  switch (isAccessible) {
    case 'yes':
    case true: return 'green';
    case 'limited': return 'yellow';
    case 'no':
    case false: return isPartiallyAccessible ? 'yellow' : 'red';
    default: return 'gray';
  }
}

export default colors;
