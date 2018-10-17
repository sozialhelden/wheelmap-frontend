// @flow

import type { PhotoModel } from '../PhotoModel';
import type { WheelmapFeaturePhotos } from '../Feature';

export default function convertWheelmapPhotosToLightboxPhotos(
  wheelmapPhotos: WheelmapFeaturePhotos
): PhotoModel[] {
  return wheelmapPhotos.photos.map(wheelmapPhoto => ({
    original: wheelmapPhoto.images.find(i => i.type === 'gallery_ipad_retina').url,
    src: wheelmapPhoto.images.find(i => i.type === 'thumb_iphone_retina').url,
    srcSet: wheelmapPhoto.images
      .filter(i => !i.type.match(/thumb/) && !i.type.match(/gallery_preview/))
      .map(image => `${image.url} ${image.width}w`),
    sizes: ['(min-width: 480px) 100px,33vw'],
    width: wheelmapPhoto.images.find(i => i.type === 'gallery_ipad_retina').width,
    height: wheelmapPhoto.images.find(i => i.type === 'gallery_ipad_retina').height,
    imageId: wheelmapPhoto.id,
    source: 'wheelmap',
  }));
}
