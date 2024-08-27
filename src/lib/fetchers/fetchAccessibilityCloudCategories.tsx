import useSWR from 'swr'
import { useCurrentAppToken } from '../context/AppContext'
import { useEnvContext } from '../context/EnvContext'
import { ACCategory } from '../model/ac/categories/ACCategory'
import { generateSynonymCache } from '../model/ac/categories/Categories'

export async function fetchAccessibilityCloudCategories(
  appToken: string,
  baseUrl: string,
): Promise<ACCategory[]> {
  const url = `${baseUrl}/categories.json?appToken=${appToken}`
  const r = await fetch(url, {
    method: 'GET',
  })
  const json = await r.json()
  return (json as any).results
}

export async function fetchAccessibilityCloudCategorySynonymCache(
  appToken: string,
  baseUrl: string,
) {
  const categories = await fetchAccessibilityCloudCategories(appToken, baseUrl)
  const synonyms = generateSynonymCache(categories)
  return synonyms
}

export const useCategorySynonymCache = () => {
  const appToken = useCurrentAppToken()
  const env = useEnvContext()
  const baseUrl = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
  return useSWR(appToken && baseUrl && [appToken, baseUrl] || null, fetchAccessibilityCloudCategorySynonymCache)
}
