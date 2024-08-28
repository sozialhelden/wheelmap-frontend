import SearchButton from './SearchButton'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

export const SearchButtonOrInput = () => {
  const { searchParams, accessibilityFilter, toiletFilter } = useAppStateAwareRouter()
  const { category } = searchParams

  return (
    <SearchButton accessibilityFilter={accessibilityFilter} toiletFilter={toiletFilter} category={category} />
  )
}
