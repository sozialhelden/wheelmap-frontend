// @flow

import type { PhotoModel } from './PhotoModel';
import type { AccessibilityCloudImages } from '../../../lib/Feature';

export default function convertAcPhotosToLightboxPhotos(acPhotos: AccessibilityCloudImages): PhotoModel[] {
  return acPhotos.images.map(acPhoto => ({
    src: acPhoto.url,
    srcSet: [acPhoto.url],
    sizes: ['(min-width: 480px) 100px,33vw'],
    width: 1,
    height: 1,
  }));
}