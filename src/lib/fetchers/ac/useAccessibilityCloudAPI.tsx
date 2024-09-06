import { useCurrentAppToken } from '../../context/AppContext'
import { useEnvContext } from '../../context/EnvContext'

export default function useAccessibilityCloudAPI({ cached = true }: { cached: boolean }) {
  const env = useEnvContext()
  const appToken = useCurrentAppToken() || env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
  const baseUrl = cached ? env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL : env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL
  return { baseUrl, appToken }
}
