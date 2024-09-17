import styled from 'styled-components'
import SearchButton from './SearchButton'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import SearchPanel from './SearchPanel'

const SearchContainer = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;

    > .search-button {
        display: none;
    }

    @media (max-width: 768px), (max-height: 512px) {
        > .search-button {
            display: flex;
        }
        
        > .search-panel {
            display: none;
        }
    }
`

export const SearchButtonOrInput = () => {
  const { searchParams, accessibilityFilter, toiletFilter } = useAppStateAwareRouter()
  const { category } = searchParams

  const router = useAppStateAwareRouter()
  const shouldBeHidden = router.nextRouter.pathname.startsWith('/search')

  if (shouldBeHidden) {
    return null
  }

  return (
    <SearchContainer>
      <SearchButton className="search-button" accessibilityFilter={accessibilityFilter} toiletFilter={toiletFilter} category={category} />
      <SearchPanel
        className="search-panel"
        inert
        onChangeSearchQuery={() => {}}
        onClick={() => router.push('/search')}
        isExpanded={false}
        accessibilityFilter={accessibilityFilter}
        toiletFilter={toiletFilter}
        category={category}
      />
    </SearchContainer>
  )
}
