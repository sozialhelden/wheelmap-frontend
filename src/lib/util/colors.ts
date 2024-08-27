import { EquipmentProperties, PlaceProperties } from '@sozialhelden/a11yjson'
import { hsl, rgb } from 'd3-color'
import { interpolateHsl, interpolateLab } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import reduce from 'lodash/reduce'
import { YesNoLimitedUnknown } from '../model/ac/Feature'
import { isWheelchairAccessible } from '../model/accessibility/isWheelchairAccessible'

const colors = {
  primaryColor: '#79B63E',
  primaryColorDarker: '#4d7227',
  primaryColorBrighter: 'rgba(0, 0, 0, 0.7)',
  secondaryColor: '#8B6A43',
  darkLinkColor: '#455668',
  linkColor: '#2e6ce0',
  textColor: '#111',
  textColorTonedDown: null, // calculated below
  textColorTonedDownSlightly: null, // calculated below
  textColorBrighter: 'rgba(16, 16, 16, 0.8)',
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
  coldBackgroundColor: null, // calculated below
  editHintBackgroundColor: null, // calculated below
  halfTonedDownSelectedColor: null, // calculated below
  borderColor: null, // calculated below
  positiveColor: 'rgb(126, 197, 18)',
  positiveColorDarker: '#467500',
  positiveBackgroundColorTransparent: 'rgba(126, 197, 18, 0.1)',
  warningColor: 'rgb(243, 158, 59)',
  warningColorDarker: '#c16600',
  warningBackgroundColorTransparent: 'rgba(243, 158, 59, 0.1)',
  negativeColor: 'rgb(245, 75, 75)',
  halfTransparentNegative: 'rgba(245, 75, 75, 0.5)',
  negativeColorDarker: '#c70000',
  negativeBackgroundColorTransparent: 'rgba(245, 75, 75, 0.1)',
  neutralColor: 'rgb(88, 87, 83)',
  neutralBackgroundColorTransparent: 'rgba(88, 87, 83, 0.11)',
  notificationBackgroundColor: 'rgb(86, 105, 140)',
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
  },
  inputBorder: '#ddd',
  textMuted: 'rgba(0,0,0,0.6)',
  focusOutline: '#C3E8FD',
}

colors.coldBackgroundColor = hsl(colors.linkBackgroundColorTransparent)
colors.coldBackgroundColor.opacity *= 0.5
colors.halfTonedDownSelectedColor = interpolateLab(
  colors.tonedDownSelectedColor,
  colors.selectedColor,
)(0.5)
colors.borderColor = interpolateLab(
  colors.tonedDownSelectedColor,
  'rgba(255, 255, 255, 0.5)',
)(0.6)
colors.editHintBackgroundColor = hsl(colors.linkColor).darker(0.5)
colors.editHintBackgroundColor.s -= 0.5
colors.textColorTonedDown = interpolateLab(
  colors.tonedDownSelectedColor,
  colors.textColor,
)(0.5)
colors.textColorTonedDownSlightly = interpolateLab(
  colors.tonedDownSelectedColor,
  colors.textColor,
)(0.6)

export function coloredWhite(color: string, value: number = 0.5) {
  const labColor = hsl(color)
  return interpolateHsl(labColor, 'white')(value).toString()
}

export function textOnColoredBackground(color: string): string {
  const hslColor = hsl(color)
  if (color === undefined || hslColor.l > 0.8) {
    return '#37404D'
  }
  return coloredWhite(color, 8)
}

export function brighter(color: string, value: number = 0.3) {
  return hsl(color)
    .brighter(value)
    .toString()
}

export function darker(color: string, value: number = 0.3) {
  return hsl(color)
    .darker(value)
    .toString()
}

export function alpha(color: string, value: number = 0.4) {
  const alphaColor = rgb(color)
  alphaColor.opacity *= value
  return alphaColor.toString()
}

export function mixLab(color1: string, color2: string, ratio: number = 0.5) {
  return interpolateLab(color1, color2)(ratio).toString()
}

export function getHTMLColorForWheelchairAccessibilityValue(
  isAccessible: YesNoLimitedUnknown,
): string {
  return colors.markers.background[isAccessible]
}

export function getColorForWheelchairAccessibility(
  properties: PlaceProperties | EquipmentProperties,
): string {
  return isWheelchairAccessible(properties)
}

const interpolateYesLimited = interpolateLab(
  colors.markers.background.limited,
  colors.markers.background.yes,
)

function calculateWheelchairAccessibility(
  propertiesArray: (PlaceProperties | EquipmentProperties)[],
) {
  if (!propertiesArray || propertiesArray.length === 0) {
    return { definedCount: 0 }
  }

  // take a 'random' selection when there are too many places
  const filterMod = Math.floor(propertiesArray.length / 30)
  const selectedEntries = filterMod > 0
    ? propertiesArray.filter((e, i) => i % filterMod === 0)
    : propertiesArray

  const accessibilityValues = selectedEntries.map(isWheelchairAccessible)
  const undefinedCount = accessibilityValues.filter((c) => c === 'unknown')
    .length
  const definedCount = accessibilityValues.length - undefinedCount
  if (definedCount === 0) {
    return { definedCount: 0 }
  }
  const ratingForAccessibility = (accessibility) => ({
    unknown: 0, no: 0, limited: 0.5, yes: 1,
  }[accessibility])
  const reduceFn = (acc, accessibility) => acc + ratingForAccessibility(accessibility)
  const totalRatingForDefined = reduce(accessibilityValues, reduceFn, 0)
  const averageRatingForDefined = totalRatingForDefined / definedCount
  const definedRatio = definedCount / accessibilityValues.length
  // Don't take unknown values into account that much
  const clampedDefinedRatio = Math.min(1.0, 0.5 + definedRatio)

  return { definedCount, averageRatingForDefined, clampedDefinedRatio }
}

const definedAccessibilityMapping: [YesNoLimitedUnknown, number][] = [
  ['yes', 0.8],
  ['limited', 0.2],
  ['no', 0],
]

function getWheelchairAccessibility(
  definedCount: number,
  averageRatingForDefined: number,
  clampedDefinedRatio: number,
): YesNoLimitedUnknown {
  if (definedCount === 0) {
    return 'unknown'
  }

  for (const [accessibility, maxValue] of definedAccessibilityMapping) {
    if (averageRatingForDefined > maxValue) return accessibility
  }

  return 'unknown'
}

const definedAccessibilityBackgroundColorScale = scaleLinear<string>()
  .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
  .range([
    colors.markers.background.no,
    colors.markers.background.limited,
    interpolateYesLimited(0.25),
    interpolateYesLimited(0.5),
    interpolateYesLimited(0.75),
    colors.markers.background.yes,
  ])

function getWheelchairAccessibilityColors(
  definedCount: number,
  averageRatingForDefined: number,
  clampedDefinedRatio: number,
) {
  if (definedCount === 0) {
    return {
      backgroundColor: colors.markers.background.unknown,
      foregroundColor: colors.markers.foreground.unknown,
    }
  }

  const averageAccessibilityForDefinedBackground = definedAccessibilityBackgroundColorScale(
    averageRatingForDefined,
  )
  const backgroundColor = interpolateLab(
    colors.markers.background.unknown,
    averageAccessibilityForDefinedBackground,
  )(clampedDefinedRatio)

  const foregroundColor = 'white'

  return { backgroundColor, foregroundColor }
}

export function interpolateWheelchairAccessibilityColors(
  propertiesArray: (PlaceProperties | EquipmentProperties)[],
) {
  const {
    definedCount,
    averageRatingForDefined,
    clampedDefinedRatio,
  } = calculateWheelchairAccessibility(propertiesArray)

  return getWheelchairAccessibilityColors(
    definedCount,
    averageRatingForDefined,
    clampedDefinedRatio,
  )
}

export function interpolateWheelchairAccessibility(
  propertiesArray: (PlaceProperties | EquipmentProperties)[],
) {
  const {
    definedCount,
    averageRatingForDefined,
    clampedDefinedRatio,
  } = calculateWheelchairAccessibility(propertiesArray)
  const colors = getWheelchairAccessibilityColors(
    definedCount,
    averageRatingForDefined,
    clampedDefinedRatio,
  )
  const accessibility = getWheelchairAccessibility(
    definedCount,
    averageRatingForDefined,
    clampedDefinedRatio,
  )

  return { ...colors, accessibility }
}

export default colors
