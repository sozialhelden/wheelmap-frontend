import Color from 'colorjs.io'
import { compact, uniq } from 'lodash'
import { t } from 'ttag'

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
  if (hslColor.l < 10) return t`very dark`
  if (hslColor.l < 40) return t`dark`
  if (hslColor.l < 80) return t`light`
  if (hslColor.l > 90) return t`very bright`
  return null
}

export function classifyHSLColor(hslColor: Color) {
  const hue = classifyHue(hslColor)
  const lightness = classifyLightness(hslColor)
  const saturation = classifySaturation(hslColor)
  const strings = uniq(compact([lightness, saturation, hue])).join(' ')
  return strings
}
