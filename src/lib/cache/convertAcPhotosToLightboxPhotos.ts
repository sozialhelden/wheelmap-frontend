import { PhotoModel } from '../PhotoModel';
import { AccessibilityCloudImage, AccessibilityCloudImages } from '../Feature';
import env from '../env';

const makeSrcUrl = (acPhoto: AccessibilityCloudImage, size: number) => {
  return `${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}/images/scale/${
    acPhoto.imagePath
  }?fitw=${size}&fith=${size}`;
};

const makeCachedImageSrcSetEntry = (acPhoto: AccessibilityCloudImage, size: number) => {
  return `${makeSrcUrl(acPhoto, size)} ${size / 2}w`;
};

const thumbnailSizes = [96, 192, 384];
const thumbnailMediaSelector = [
  `(min-resolution: 192dpi) 300px`,
  `(min-resolution: 120dpi) 200px`,
  `100px`,
];

const fullScreenSizes = [480, 960, 1920];
const fullScreenMediaSelector = [
  `(min-width: 480px) 480px`,
  `(min-width: 960px) 960px`,
  `(min-width: 1920px) 1920px`,
  `960px`,
];

const makeSrcSet = (sizes: number[], acPhoto: AccessibilityCloudImage) => {
  return sizes.map(s => makeCachedImageSrcSetEntry(acPhoto, s));
};

export default function convertAcPhotosToLightboxPhotos(
  acPhotos: AccessibilityCloudImages
): PhotoModel[] {
  return acPhotos.images.map(acPhoto => ({
    original: makeSrcUrl(acPhoto, 1200),
    src: makeSrcUrl(acPhoto, 1366),
    srcSet: makeSrcSet(fullScreenSizes, acPhoto),
    sizes: fullScreenMediaSelector,
    thumbnailSrcSet: makeSrcSet(thumbnailSizes, acPhoto),
    thumbnailSizes: thumbnailMediaSelector,
    width: acPhoto.dimensions ? acPhoto.dimensions.width : 1,
    height: acPhoto.dimensions ? acPhoto.dimensions.height : 1,
    imageId: acPhoto._id,
    source: 'accessibility-cloud',
  }));
}
