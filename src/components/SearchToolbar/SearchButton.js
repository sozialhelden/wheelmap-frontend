// @flow

import * as React from 'react';
import SearchIcon from './SearchIcon';
import MapButton from '../MapButton';
import { t } from 'ttag';
import styled from 'styled-components';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { isAccessibilityFiltered } from '../../lib/Feature';
import Categories from '../../lib/Categories';
import CombinedIcon from './CombinedIcon';
import BreadcrumbChevron from '../icons/ui-elements/BreadcrumbChevron';

type Props = {
  onClick: () => void,
  className: string,
  category: ?string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
};

const Caption = styled.div.attrs({ className: 'caption' })`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.75rem 0 0;
`;

function SearchButton(props: Props) {
  const classNames = ['btn-unstyled', 'search-button', props.className];

  const { toiletFilter, accessibilityFilter, category } = props;
  const isAnyFilterSet = isAccessibilityFiltered(accessibilityFilter) || category;
  // translator: Shown in collapsed search/filter combi button when there is no category filter set
  const allPlacesCaption = t`All places`;

  return (
    <MapButton
      {...props}
      aria-label={t`Search`}
      aria-controls="search"
      className={classNames.join(' ')}
    >
      <SearchIcon />

      <BreadcrumbChevron />

      {isAnyFilterSet && (
        <CombinedIcon {...{ toiletFilter, accessibilityFilter, category, isMainCategory: true }} />
      )}

      <Caption>
        {category ? Categories.translatedWheelmapRootCategoryName(category) : allPlacesCaption}
      </Caption>
    </MapButton>
  );
}

const StyledSearchButton = styled(SearchButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.2rem;

  width: auto;
  max-width: calc(100vw - 80px);
  min-height: 50px;
  margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);
  margin-left: constant(safe-area-inset-left);
  margin-left: env(safe-area-inset-left);

  .breadcrumb-chevron {
    width: 24px;
    height: 40px;
    margin-right: 10px;
    opacity: 0.5;
  }

  svg.search-icon {
    width: 20px;
    height: 20px;
    margin-left: 0.75rem;
    path {
      fill: #334455;
    }
  }
`;

export default StyledSearchButton;
