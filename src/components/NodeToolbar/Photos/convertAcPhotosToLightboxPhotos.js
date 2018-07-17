// @flow

import type { PhotoModel } from './PhotoModel';
import type { AccessibilityCloudImages } from '../../../lib/Feature';

export default function convertAcPhotosToLightboxPhotos(acPhotos: AccessibilityCloudImages): PhotoModel[] {
  return acPhotos.images.map(acPhoto => ({
    src: acPhoto.url,
    srcSet: [acPhoto.url],
    sizes: ['(min-width: 480px) 100px,33vw'],
    width: acPhoto.dimensions ? acPhoto.dimensions.width : 1,
    height: acPhoto.dimensions ? acPhoto.dimensions.height : 1,
    imageId: acPhoto._id,
    source: 'accessibility-cloud',
  }));
}