import { useCurrentAppToken } from '../../context/AppContext'
import { useEnvContext } from '../../context/EnvContext'

export default function useOSMAPI({ cached = true }: { cached: boolean }) {
  const env = useEnvContext()
  const appToken = useCurrentAppToken() || env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
  const baseUrl = cached ? env.NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL.replace(/\{n\}/, '1') : env.NEXT_PUBLIC_OSM_API_BACKEND_URL
  return { baseUrl, appToken }
}
