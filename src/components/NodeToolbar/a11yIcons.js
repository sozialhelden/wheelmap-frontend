// @flow
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';

type A11yIcon = {
  iconUrl: string,
  caption: string,
};

// TODO better type than any here?
type A11yIconGeneratorFn = (a11y: any) => ?A11yIcon;

const inductionLoopIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'hasInductionLoop')
    ? { iconUrl: 'someIconUrl', caption: 'text for induction loop' }
    : null;

const guideDogIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'accessibleWith.guideDog')
    ? { iconUrl: 'someIconUrl', caption: 'text for guide dog' }
    : null;

const mainEntranceIcon: A11yIconGeneratorFn = a11y => {
  const entrance = get(a11y, 'entrances[0]');

  if (entrance) {
    if (entrance.isMainEntrance) {
      return {
        iconUrl: 'someUrl',
        caption: 'use the main entrance',
      };
    } else {
      return {
        iconUrl: 'someUrl',
        caption: 'look for a side entrance',
      };
    }
  } else {
    return null;
  }
};

const fixedRampIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'entrances[0].hasFixedRamp')
    ? {
        iconUrl: 'someUrl',
        caption: 'fixed ramp text',
      }
    : null;

const removableRampIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'entrances[0].hasRemovableRamp')
    ? {
        iconUrl: 'someUrl',
        caption: 'removable ramp text',
      }
    : null;

const stairsCountIcon: A11yIconGeneratorFn = a11y => {
  const stairsCount = get(a11y, 'entrances[0].stairs.count');
  return stairsCount
    ? {
        iconUrl: 'someUrl',
        caption: `has ${stairsCount} stairs`,
      }
    : null;
};

const stepHeightIcon: A11yIconGeneratorFn = a11y => {
  const stepHeight = get(a11y, 'entrances[0].stairs.stepHeight');
  return stepHeight
    ? {
        iconUrl: 'someUrl',
        caption: `stairs have height of ${stepHeight}`,
      }
    : null;
};

const turningSpaceInsideIcon: A11yIconGeneratorFn = a11y => {
  const turningSpaceInside = get(a11y, 'restrooms[0].turningSpaceInside');
  return turningSpaceInside
    ? {
        iconUrl: 'someUrl',
        caption: `turning space of ${turningSpaceInside}`,
      }
    : null;
};

const a11yIconMapping = {
  accessibility: [inductionLoopIcon, guideDogIcon],
  entrances: [mainEntranceIcon, fixedRampIcon, removableRampIcon, stairsCountIcon, stepHeightIcon],
  restrooms: [turningSpaceInsideIcon],
};

// TODO better type than any here
const a11yIcons = (a11y: any) => {
  let result = mapValues(a11yIconMapping, fns => fns.map(fn => fn(a11y)));
  result = mapValues(result, a11yIconsForSection => a11yIconsForSection.filter(Boolean));
  result = pickBy(result, iconList => iconList.length > 0);
  return result;
};

export default a11yIcons;
