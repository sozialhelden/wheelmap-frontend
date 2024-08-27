import { WheelmapFeaturePhotos } from './Feature';
import { PhotoModel } from './PhotoModel';

export default function convertWheelmapPhotosToLightboxPhotos(
  wheelmapPhotos: WheelmapFeaturePhotos,
): PhotoModel[] {
  return wheelmapPhotos.photos.map((wheelmapPhoto) => {
    const retinaPhoto = wheelmapPhoto.images.find((i) => i.type === 'gallery_ipad_retina');
    const retinaThumb = wheelmapPhoto.images.find((i) => i.type === 'thumb_iphone_retina');
    const images = wheelmapPhoto.images
      .filter(
        (i) => !i.type.match(/thumb/) && !i.type.match(/gallery_preview/) && i.type !== 'original',
      )
      .map((image) => ({
        src: image.url,
        width: image.width,
        height: image.height,
      }));

    return {
      original: retinaPhoto.url,
      src: retinaThumb.url,
      images,
      sizes: ['(min-width: 480px) 100px,33vw'],
      width: retinaPhoto.width,
      height: retinaPhoto.height,
      key: String(wheelmapPhoto.id),
      appSource: 'wheelmap',
      angle: 0,
    };
  });
}
