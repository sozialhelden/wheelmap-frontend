import { compact } from 'lodash'
import { AccessibilityCloudImage } from '../../../../lib/model/ac/Feature'
import { AnyFeature, isOSMFeature, isPlaceInfo } from '../../../../lib/model/geo/AnyFeature'

const context = ['osmGeometry', 'place', 'surveyResult'] as const

export const calculateDimensionsToFit = (acPhoto: AccessibilityCloudImage, maxSize: number) => {
  if (!acPhoto.dimensions) {
    return { width: maxSize, height: maxSize }
  }

  const { width, height } = acPhoto.dimensions
  const ratio = width / height
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / ratio),
    }
  }
  return {
    width: Math.round(maxSize * ratio),
    height: maxSize,
  }
}

export const makeSrcLocation = (baseUrl: string, image: AccessibilityCloudImage, size: number) => {
  const { width, height } = calculateDimensionsToFit(image, size)
  const angleFragment = image.angle ? `&angle=${((image.angle % 360) + 360) % 360}` : ''

  return `${baseUrl}/images/scale/${image.imagePath}?fit=inside&fitw=${width}&fith=${height}${angleFragment}`
}

export const makeCachedImageSrcSetEntry = (baseUrl, acPhoto: AccessibilityCloudImage, size: number) => ({
  src: makeSrcLocation(baseUrl, acPhoto, size),
  width: size,
  height: size,
})

export const thumbnailSizes = [96, 192, 384]

export const fullScreenSizes = [480, 960, 1500]

export const makeSrcSet = (baseUrl: string, sizes: number[], acPhoto: AccessibilityCloudImage) => sizes.map((s) => makeCachedImageSrcSetEntry(baseUrl, acPhoto, s))
export const makeSrcSetLocation = (srcSet: ReturnType<typeof makeSrcSet>) => srcSet.map((x) => `${x.src} ${x.width}w`).join(',')

export const makeImageLocation = (baseUrl: string, appToken: string, ctx: typeof context[number], id: string) => `${
  baseUrl
}/images.json?context=${ctx}&objectId=${id}&appToken=${appToken}`

export const makeImageIds = (feature: AnyFeature): { context: typeof context[number], id: string }[] => {
  const combinations = compact([
    isOSMFeature(feature) && { context: 'place', id: feature._id.replace(/^way\//, '-').replace(/^node\//, '') } as const,
    isPlaceInfo(feature) && { context: 'place', id: feature._id } as const,
    isOSMFeature(feature) && { context: 'osmGeometry', id: `osm:${feature._id}` } as const,
    isPlaceInfo(feature)
      && feature.properties?.surveyResultId && { context: 'surveyResult', id: feature.properties.surveyResultId } as const,
  ] as const)
  return combinations
}
