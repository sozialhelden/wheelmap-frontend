import SearchButton from './SearchButton'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { getAccessibilityFilterFrom } from '../../lib/model/ac/filterAccessibility'
import { YesNoUnknown } from '../../lib/model/ac/Feature'

export const SearchButtonOrInput = () => {
  const { searchParams } = useAppStateAwareRouter()
  const accessibilityFilter = getAccessibilityFilterFrom(searchParams.wheelchair)
  const toiletFilter = getAccessibilityFilterFrom(searchParams.toilet) as YesNoUnknown[]
  const { category } = searchParams

  return (
    <SearchButton accessibilityFilter={accessibilityFilter} toiletFilter={toiletFilter} category={category} />
  )
}
