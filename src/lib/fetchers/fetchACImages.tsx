type ContextName = 'place' | 'equipmentInfo';

export function fetchImages(
  appToken: string,
  baseUrl: string,
  context: ContextName,
  objectId: string,
) {
  return fetch(
    `${baseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`,
  )
    .then((r) => r.json())
    .then((json) => json.images);
}
