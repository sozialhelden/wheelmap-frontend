// @flow
import mapValues from 'lodash/mapValues';
import mapKeys from 'lodash/mapKeys';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import { t } from 'ttag';

type A11yIcon = {
  iconUrl: string,
  caption: string,
};

// TODO better type than any here?
type A11yIconGeneratorFn = (a11y: any) => ?A11yIcon;

const iconUrlPrefix = '/images/a11yIcons/';

const inductionLoopIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'hasInductionLoop')
    ? {
        iconUrl: iconUrlPrefix + 'InductionLoop.svg',
        caption: `${get(a11y, 'hasInductionLoopLocalized')}`,
      }
    : null;

const guideDogIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'accessibleWith.guideDog')
    ? {
        iconUrl: iconUrlPrefix + 'GuideDog.svg',
        caption: `${get(a11y, 'accessibleWith.guideDogLocalized')}`,
      }
    : null;

const mainEntranceIcon: A11yIconGeneratorFn = a11y => {
  const entrance = get(a11y, 'entrances[0]');

  if (entrance) {
    if (entrance.isMainEntrance) {
      // translator: Asks the user to use the main entrance
      const caption = t`use the main entrance`;
      return {
        iconUrl: iconUrlPrefix + 'MainEntrance.svg',
        caption,
      };
    } else {
      // translator: Asks the user to look for a side entrance
      const caption = t`look for a side entrance`;
      return {
        iconUrl: iconUrlPrefix + 'MainEntrance.svg',
        caption,
      };
    }
  } else {
    return null;
  }
};

const fixedRampIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'entrances[0].hasFixedRamp')
    ? {
        iconUrl: iconUrlPrefix + 'FixedRamp.svg',
        caption: get(a11y, 'entrances[0].hasFixedRampLocalized'),
      }
    : null;

const removableRampIcon: A11yIconGeneratorFn = a11y =>
  get(a11y, 'entrances[0].hasRemovableRamp')
    ? {
        iconUrl: iconUrlPrefix + 'RemovableRamp.svg',
        caption: get(a11y, 'entrances[0].hasRemovableRampLocalized'),
      }
    : null;

const stairsCountIcon: A11yIconGeneratorFn = a11y => {
  const stairsCount = get(a11y, 'entrances[0].stairs.count');
  const stairsLocalized = get(a11y, 'entrances[0].stairsLocalized');
  const countLocalized = get(a11y, 'entrances[0].stairs.countLocalized');
  return stairsCount
    ? {
        iconUrl: iconUrlPrefix + 'StairsCount.svg',
        caption: `${stairsLocalized} ${countLocalized}: ${stairsCount}`,
      }
    : null;
};

const stepHeightIcon: A11yIconGeneratorFn = a11y => {
  const stepHeight = get(a11y, 'entrances[0].stairs.stepHeight');
  const stepHeightLocalized = get(a11y, 'entrances[0].stairs.stepHeightLocalized');
  const value = stepHeight.value + stepHeight.unit;

  return stepHeight
    ? {
        iconUrl: iconUrlPrefix + 'StairsStepHeight.svg',
        caption: `${stepHeightLocalized}: ${value}`,
      }
    : null;
};

const turningSpaceInsideIcon: A11yIconGeneratorFn = a11y => {
  const turningSpaceInside = get(a11y, 'restrooms[0].turningSpaceInside');
  const turningSpaceInsideLocalized = get(a11y, 'restrooms[0].turningSpaceInsideLocalized');
  const value = turningSpaceInside.value + turningSpaceInside.unit;
  return turningSpaceInside
    ? {
        iconUrl: iconUrlPrefix + 'RestroomTurningSpaceInside.svg',
        caption: `${turningSpaceInsideLocalized}: ${value}`,
      }
    : null;
};

const a11yIconMapping = {
  accessibility: [inductionLoopIcon, guideDogIcon],
  entrances: [mainEntranceIcon, fixedRampIcon, removableRampIcon, stairsCountIcon, stepHeightIcon],
  restrooms: [turningSpaceInsideIcon],
};

const a11yCategoryLocalizationMapping = {
  accessibility: 'accessibleWithLocalized',
  entrances: 'entrancesLocalized',
  restrooms: 'restroomsLocalized',
};

// TODO better type than any here
const a11yIcons = (a11y: any) => {
  let result = mapValues(a11yIconMapping, fns => fns.map(fn => fn(a11y)));
  result = mapValues(result, a11yIconsForSection => a11yIconsForSection.filter(Boolean));
  result = pickBy(result, iconList => iconList.length > 0);
  result = mapKeys(result, (_, key) => a11y[a11yCategoryLocalizationMapping[key]]);
  return result;
};

export default a11yIcons;
