import { PhotoModel } from '../PhotoModel';
import { Image } from 'react-photo-album';
import { AccessibilityCloudImage, AccessibilityCloudImages } from '../Feature';
import env from '../env';

const calculateDimensionsToFit = (acPhoto: AccessibilityCloudImage, maxSize: number) => {
  if (!acPhoto.dimensions) {
    return { width: maxSize, height: maxSize };
  }

  const { width, height } = acPhoto.dimensions;
  const ratio = width / height;
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / ratio),
    };
  } else {
    return {
      width: Math.round(maxSize * ratio),
      height: maxSize,
    };
  }
};

const makeSrcUrl = (acPhoto: AccessibilityCloudImage, size: number) => {
  const { width, height } = calculateDimensionsToFit(acPhoto, size);
  return `${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}/images/scale/${
    acPhoto.imagePath
  }?fit=inside&fitw=${width}&fith=${height}${
    acPhoto.angle ? `&angle=${((acPhoto.angle % 360) + 360) % 360}` : ''
  }`;
};

const makeCachedImageSrcSetEntry = (acPhoto: AccessibilityCloudImage, size: number): Image => {
  return {
    src: makeSrcUrl(acPhoto, size),
    width: size,
    height: size,
  };
};

const thumbnailSizes = [96, 192, 384];

const fullScreenSizes = [480, 960, 1500];
const fullScreenMediaSelector = [
  `(min-width: 480px) 480px`,
  `(min-width: 960px) 960px`,
  `(min-width: 1500px) 1500px`,
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
    images: makeSrcSet(fullScreenSizes, acPhoto).concat(makeSrcSet(thumbnailSizes, acPhoto)),
    sizes: fullScreenMediaSelector,
    width: acPhoto.dimensions ? acPhoto.dimensions.width : 1,
    height: acPhoto.dimensions ? acPhoto.dimensions.height : 1,
    key: acPhoto._id,
    appSource: 'accessibility-cloud',
    _id: acPhoto._id,
    angle: acPhoto.angle,
  }));
}
