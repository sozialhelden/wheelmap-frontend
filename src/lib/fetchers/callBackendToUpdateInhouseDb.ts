import { log } from '../util/logger'

export async function callBackendToUpdateInhouseDb({
  baseUrl,
  osmId,
  osmType,
}: {
  baseUrl: string;
  osmId: string;
  osmType: string;
}) {
  log.log('writeChangesToInhouseDb', osmType, osmId)
  const osmIdAsNumber = osmId.replace(/\D/g, '')
  return fetch(`${baseUrl}/legacy/api/${osmType}/${osmIdAsNumber}/refresh`, {
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
