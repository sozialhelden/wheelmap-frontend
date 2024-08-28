export default async function postImageReport(
  appToken: string,
  baseUrl: string,
  imageId: string,
  reason: string,
) {
  const response = await fetch(
    `${baseUrl}/images/report?imageId=${imageId}&reason=${reason}&appToken=${appToken}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error.reason)
  }

  return json
}
