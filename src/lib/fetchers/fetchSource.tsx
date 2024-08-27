import ISource from '../model/ac/ISource'

export function interpretJSONResponseAsSource(json: unknown): ISource {
  return json as ISource
}

export default async function fetchSource([appToken, baseUrl, _id]: [
  string | undefined,
  string | undefined,
  string | undefined
]): Promise<ISource> {
  if (!_id || !appToken) {
    return
  }
  const url = `${baseUrl}/sources/${_id}.json?appToken=${appToken}`
  const response = await fetch(url)
  const json = await response.json()
  return interpretJSONResponseAsSource(json)
}
