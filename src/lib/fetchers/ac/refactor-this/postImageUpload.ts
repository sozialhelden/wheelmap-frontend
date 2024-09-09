import { AnyFeature, isOSMFeature, isPlaceInfo } from '../../../model/geo/AnyFeature'

const imageResizeConfig = {
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
  autoRotate: true,
  debug: true,
}

export default async function uploadPhotoForFeature(feature: AnyFeature, images: FileList, appToken: string, baseUrl: string): Promise<void> {
  const image = images[0]

  let url
  if (isPlaceInfo(feature)) {
    const id = feature._id
    url = `${baseUrl}/image-upload?placeId=${id}&appToken=${appToken}`
  } else if (isOSMFeature(feature)) {
    const uri = `osm:${feature._id}`
    url = `${baseUrl}/image-upload/osm-geometry/photo?uri=${uri}&appToken=${appToken}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'image/jpeg',
    },
    body: image,
  })

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json?.error?.reason)
  }
}
