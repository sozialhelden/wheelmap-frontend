import React from 'react'
import { t } from 'ttag'
import { TypeTaggedOSMFeature, TypeTaggedPlaceInfo } from '../../../../lib/model/geo/AnyFeature'
import DisplayedQuantity from './DisplayedQuantity'
import { determineIfZerothLevelIsSkippedHere } from './determineIfZerothLevelIsSkippedHere';
import Color from 'colorjs.io'
import { compact, uniq } from 'lodash'
import { useDarkMode } from '../../../shared/useDarkMode'
import OpeningHoursValue from './OpeningHoursValue'
import StyledMarkdown from '../../../shared/StyledMarkdown';

export type ValueRenderProps = {
  value: string | number;
  matches: RegExpMatchArray;
  languageTags: string[];
  osmFeature: TypeTaggedOSMFeature | undefined;
  accessibilityCloudFeature: TypeTaggedPlaceInfo | undefined;
};

function classifyHue(hslColor: Color) {
  if (hslColor.s < 10) return t`gray`
  if (hslColor.h < 20) return t`red`
  if (hslColor.h < 40) return t`orange`
  if (hslColor.h < 90) return t`yellow`
  if (hslColor.h < 150) return t`green`
  if (hslColor.h < 210) return t`cyan`
  if (hslColor.h < 270) return t`blue`
  if (hslColor.h < 330) return t`magenta`
  return t`red`
}

function classifySaturation(hslColor: Color) {
  if (hslColor.s < 10) return t`gray`
  if (hslColor.s < 50) return t`pastel`
  return t`saturated`
}

function classifyLightness(hslColor: Color) {
  if (hslColor.l < 10) return t`black`
  if (hslColor.l < 40) return t`dark`
  if (hslColor.l < 80) return t`light`
  if (hslColor.l > 90) return t`white`
  return null;
}

function classifyHSLColor(hslColor: Color) {
  const hue = classifyHue(hslColor);
  const lightness = classifyLightness(hslColor);
  const saturation = classifySaturation(hslColor);
  const strings = uniq(compact([saturation, lightness, hue])).join(' ')
  return strings;
}

function BuildingLevel({ value, osmFeature, languageTags }: ValueRenderProps) {
  const featureProperties = osmFeature?.properties;
  // https://wiki.openstreetmap.org/wiki/Key:level#Level_designations
  if (featureProperties?.['level:ref'] || featureProperties?.['addr:floor'])  {
    // In case the level has a human-readable reference, we display it as a string so the UI matches signs in the real world.
    return null;
  }

  const valueAsNumber = typeof value === 'number' ? value : parseFloat(value);

  const isUnderground = valueAsNumber < 0;
  if (isUnderground) {
    if (valueAsNumber === -1) {
      return <>{t`Basement floor`}</>;
    }
    return <>{t`Basement ${-1 * valueAsNumber}`}</>;
  }

  const skipZerothLevel = determineIfZerothLevelIsSkippedHere(languageTags);
  const localGroundFloorLevelDesignation = skipZerothLevel ? 1 : 0;
  const isGroundFloor = valueAsNumber === localGroundFloorLevelDesignation;
  if (isGroundFloor) {
    return <>{t`Ground floor`}</>;
  }
  const displayedLevel = skipZerothLevel ? valueAsNumber + 1 : valueAsNumber;

  return <span>{t`Floor ${displayedLevel}`}</span>;
}

function DisplayedColor({ value }: { value: string }) {
  const color = new Color(String(value));
  const hslColor = color.to('hsl');
  let classifiedColor = classifyHSLColor(hslColor)
  const isDarkMode = useDarkMode();
  const textColor = hslColor.mix(isDarkMode ? 'white' : 'black', .5, {space: "lch", outputSpace: "srgb"});
  return <span style={{ display: 'flex', gap: '.25rem', alignItems: 'center' }}>
    <span
      lang="en"
      aria-label={""}
      style={{
        backgroundColor: String(value),
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 0 1px rgba(0,0,0,.5), inset 0 2px 4px rgba(255, 255, 255, .2), 0 1px 10px rgba(0,0,0,.1)',
        width: '1rem',
        height: '1rem',
        lineHeight: '1rem',
        display: 'inline-block',
      }}
    />
    <span style={{ color: textColor.toString({precision: 3}) }}>
      {String(classifiedColor)}
    </span>
  </span>
}
/**
 * This file contains functions that render values of OSM tags in a human-readable way.
 * The functions are used in the {@link OSMTagTable} to display the values of OSM tags.
 *
 * The keys of the `valueRenderFunctions` object are regular expressions that match OSM tag keys.
 * The values are functions that take a {@link ValueRenderProps} object and return a React node.
 */

export const valueRenderFunctions: Record<
  string, (props: ValueRenderProps) => React.ReactNode
> = {
  '^opening_hours$': ({ value }) => <OpeningHoursValue value={String(value)} />,
  '^opening_hours:(atm|covid19|drive_through|kitchen|lifeguard|office|pharmacy|reception|store|workshop)$': ({ value }) => <OpeningHoursValue value={String(value)} />,
  '^step_height$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="cm" />,
  '^entrance_width$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="cm" />,
  '^width$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="m" />,
  '^height$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="m" />,
  '^depth$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="m" />,
  '^level$': (props) => <BuildingLevel {...props} />,
  '^colour$': ({ value }) => <DisplayedColor value={String(value)} />,
  '^power_supply:voltage$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="V" />,
  '^power_supply:current$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="A" />,
  '^power_supply:maxcurrent$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="A" />,
  '^power_supply:frequency$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="Hz" />,
  '^socket:([\w_]+)$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="×" />,
  '^(?:socket:([\w_]+):)?amperage$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="A" />,
  '^(?:socket:([\w_]+):)?current$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="A" />,
  '^(?:socket:([\w_]+):)?maxamperage$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="A" />,
  '^(?:socket:([\w_]+):)?voltage$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="V" />,
  '^(?:socket:([\w_]+):)?output$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="W" />,
  '^kerb:height$': ({ value }) => <DisplayedQuantity value={value} defaultUnit="m" />,
  '^(?:([\w_]+):)?description(?:(\w\w))?$': ({ value, matches }) => {
    const text = value
    const targetGroup = matches[1]
    const lang = matches[2]
    const targetGroupMarker = {
      'wheelchair': '🧑‍🦼‍➡️',
      'hearing': '👂',
      'blind': '👁️',
    }[targetGroup];
    return <StyledMarkdown lang={lang}>
      {t`${targetGroupMarker} “${text}”`}
    </StyledMarkdown>
  },
}

