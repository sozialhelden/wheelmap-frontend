import { PhotoModel } from '../PhotoModel';
import { WheelmapFeaturePhotos } from '../Feature';

export default function convertWheelmapPhotosToLightboxPhotos(
  wheelmapPhotos: WheelmapFeaturePhotos
): PhotoModel[] {
  return wheelmapPhotos.photos.map(wheelmapPhoto => {
    const retinaPhoto = wheelmapPhoto.images.find(i => i.type === 'gallery_ipad_retina');
    const retinaThumb = wheelmapPhoto.images.find(i => i.type === 'thumb_iphone_retina');
    const srcSet = wheelmapPhoto.images
      .filter(
        i => !i.type.match(/thumb/) && !i.type.match(/gallery_preview/) && i.type !== 'original'
      )
      .map(image => `${image.url} ${image.width}w`);
    return {
      original: retinaPhoto.url,
      src: retinaThumb.url,
      srcSet,
      sizes: ['(min-width: 480px) 100px,33vw'],
      width: retinaPhoto.width,
      height: retinaPhoto.height,
      imageId: wheelmapPhoto.id,
      source: 'wheelmap',
    };
  });
}
