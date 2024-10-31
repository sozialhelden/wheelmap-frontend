import { log } from '../util/logger'

export async function makeChangeRequestToApi({
  baseUrl,
  osmId,
  tagName,
  newTagValue,
  // currentTagsOnServer,
}: {
  baseUrl: string;
  osmId: string;
  tagName: string;
  newTagValue: string;
  // currentTagsOnServer: any;
}) {
  log.log('makeChangeRequestToApi', osmId, tagName, newTagValue)
  return fetch(`${baseUrl}/legacy/api/${osmId}/${tagName}`, {
    body: JSON.stringify({ value: newTagValue }),
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }).then((res) => res.text()).then((data) => {
    log.log(data)
  })
}
