// @flow

import * as React from 'react';
import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';

import ErrorBoundary from '../ErrorBoundary';
import PhotoSection from './Photos/PhotoSection';

import { type Feature } from '../../lib/Feature';
import { placeNameFor } from '../../lib/Feature';
import Categories, { type CategoryLookupTables, categoryNameFor } from '../../lib/Categories';
import DetailPanelHeader from './DetailPanelHeader';
import DetailPanelMain from './DetailPanelMain';
import SourcePraise from './SourcePraise';
import IconButtonList from './IconButtonList/IconButtonList';

type Props = {
  className?: string,
  feature: Feature,
  categories: CategoryLookupTables,
  onClose: () => void,
  iconElement: React.Node,
  accessibilitySectionElement: React.Node,
  iconButtonListElement: React.Node,
  photoSectionElement: React.Node,
  a11yDetailsElement: React.Node,
  sourcePraiseElement: React.Node,
};

const DetailPanel = ({
  className,
  feature,
  categories,
  onClose,
  iconElement,
  photoSectionElement,
  accessibilitySectionElement,
  iconButtonListElement,
  a11yDetailsElement,
  sourcePraiseElement,
}: Props) => {
  const categoryAndParentCategory = Categories.getCategoriesForFeature(categories, feature);
  const category = categoryAndParentCategory.category || categoryAndParentCategory.parentCategory;
  const categoryName = category && categoryNameFor(category);

  let placeName = placeNameFor(feature.properties, category);

  return (
    <FocusTrap>
      <div className={className}>
        <ErrorBoundary>
          {photoSectionElement}
          <DetailPanelHeader
            title={placeName}
            subtitle={categoryName}
            icon={iconElement}
            onCloseButtonClick={onClose}
          />
          <DetailPanelMain>
            {accessibilitySectionElement}
            {iconButtonListElement}
          </DetailPanelMain>
          {a11yDetailsElement}
          <footer>{sourcePraiseElement}</footer>
        </ErrorBoundary>
      </div>
    </FocusTrap>
  );
};

export default styled(DetailPanel)`
  position: absolute;
  top: 50px;
  z-index: 1100;
  width: 100%;
  height: calc(100% - 50px);
  width: calc(100% - 1rem);
  overflow: auto;
  background-color: #ffffff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  ${IconButtonList} {
    .link-button,
    .expand-button {
      margin: 0;
      width: 100%;
      svg {
        margin-left: 0;
      }
    }

    .expand-button {
      height: 74px;
    }
  }

  ${PhotoSection} {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }

  ${SourcePraise} {
    margin-top: 6rem;
    text-align: center;
  }
`;
