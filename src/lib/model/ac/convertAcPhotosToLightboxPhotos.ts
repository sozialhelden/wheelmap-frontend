import { Image } from 'react-photo-album'
import { AccessibilityCloudImage } from './Feature'
import { PhotoModel } from './PhotoModel'

const makeSrcUrl = (acPhoto: AccessibilityCloudImage, size: number) => `${process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
    || ''}/images/scale/${acPhoto.imagePath}?fitw=${size}&fith=${size}${
  acPhoto.angle ? `&angle=${((acPhoto.angle % 360) + 360) % 360}` : ''
}`

const makeCachedImageSrcSetEntry = (
  acPhoto: AccessibilityCloudImage,
  size: number,
): Image => ({
  src: makeSrcUrl(acPhoto, size),
  width: size,
  height: size,
})

const thumbnailSizes = [96, 192, 384]
const thumbnailMediaSelector = [
  '(min-resolution: 192dpi) 300px',
  '(min-resolution: 120dpi) 200px',
  '100px',
]

const fullScreenSizes = [480, 960, 1500]
const fullScreenMediaSelector = [
  '(min-width: 480px) 480px',
  '(min-width: 960px) 960px',
  '(min-width: 1500px) 1500px',
  '960px',
]

const makeSrcSet = (sizes: number[], acPhoto: AccessibilityCloudImage) => sizes.map((s) => makeCachedImageSrcSetEntry(acPhoto, s))

export default function convertAcPhotosToLightboxPhotos(
  acPhoto: AccessibilityCloudImage,
): PhotoModel[] {
  return {
    original: makeSrcUrl(acPhoto, 1200),
    src: makeSrcUrl(acPhoto, 1366),
    images: makeSrcSet(fullScreenSizes, acPhoto).concat(
      makeSrcSet(thumbnailSizes, acPhoto),
    ),
    sizes: fullScreenMediaSelector,
    width: acPhoto.dimensions ? acPhoto.dimensions.width : 1,
    height: acPhoto.dimensions ? acPhoto.dimensions.height : 1,
    key: acPhoto._id,
    appSource: 'accessibility-cloud',
  }
}
