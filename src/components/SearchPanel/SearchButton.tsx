import * as React from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import SearchIcon from './SearchIcon'
import CombinedIcon from './CombinedIcon'
import BreadcrumbChevron from '../icons/ui-elements/BreadcrumbChevron'
import { isAccessibilityFiltered } from '../../lib/model/ac/filterAccessibility'
import { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/model/ac/Feature'
import { translatedRootCategoryName } from '../../lib/model/ac/categories/Categories'
import MapButton from '../../../src-legacy/MapLegacy/MapButton'
import { AppStateLink } from '../App/AppStateLink'

type Props = {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  category?: string | null;
  accessibilityFilter?: YesNoLimitedUnknown[];
  toiletFilter?: YesNoUnknown[];
};

const Caption = styled.div.attrs({ className: 'caption' })`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const StyledButton = styled(MapButton)`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.2rem;
    width: auto;
    max-width: calc(100vw - 80px);
    min-height: 50px;
    padding: 0 0.75rem;

    > svg.breadcrumb-chevron {
        width: auto;
        height: 20px;
        opacity: 0.5;
    }

    > svg.search-icon {
        width: 20px;
        height: 20px;

        path {
            fill: #334455;
        }
    }
`

export default function SearchButton({
  toiletFilter, accessibilityFilter, category, className, ...props
}: Props) {
  const isAnyFilterSet = category || isAccessibilityFiltered(accessibilityFilter)
  // translator: Shown in collapsed search/filter combi button when there is no category filter set
  const allPlacesCaption = t`All places`
  return (
    <AppStateLink href="/search" className={className}>

      <StyledButton
        {...props}
        aria-label={t`Search`}
        aria-controls="search"
      >
        <SearchIcon className="search-icon" />

        <BreadcrumbChevron className="breadcrumb-chevron" />

        {isAnyFilterSet && (
          <CombinedIcon
            {...{
              toiletFilter,
              accessibilityFilter,
              category,
              isMainCategory: true,
            }}
          />
        )}

        <Caption>
          {category
            ? translatedRootCategoryName(category)
            : allPlacesCaption}
        </Caption>
      </StyledButton>
    </AppStateLink>
  )
}
