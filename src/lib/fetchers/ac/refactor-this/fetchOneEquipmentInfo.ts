import useSWR from 'swr'
import { useCurrentApp } from '../context/AppContext'
import { useEnvContext } from '../context/EnvContext'
import { TypeTaggedEquipmentInfo } from '../model/geo/AnyFeature'

export async function fetchOneEquipmentInfo(
  appToken: string,
  baseUrl: string,
  _id?: string,
): Promise<TypeTaggedEquipmentInfo> {
  if (!_id || !appToken || !baseUrl) {
    return Promise.resolve(undefined)
  }
  const url = `${baseUrl}/equipment-infos/${_id}.json?appToken=${appToken}`
  const r = await fetch(url)
  const json = await r.json()
  return { '@type': 'a11yjson:EquipmentInfo', ...json }
}

export const useEquipmentInfo = (_id?: string) => {
  const app = useCurrentApp()
  const appToken = app.tokenString
  const env = useEnvContext()
  const baseUrl = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_API_URL
  return useSWR(appToken && baseUrl && _id && [appToken, baseUrl, _id], fetchOneEquipmentInfo)
}
