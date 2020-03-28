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
import AccessibilitySourceDisclaimer from './AccessibilitySection/AccessibilitySourceDisclaimer';
import { ChromelessButton } from '../Button';
import IconButton from '../IconButton';

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
  sourceDisclaimerElement: React.Node,
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
  sourceDisclaimerElement,
}: Props) => {
  const categoryAndParentCategory = Categories.getCategoriesForFeature(categories, feature);
  const category = categoryAndParentCategory.category || categoryAndParentCategory.parentCategory;
  const categoryName = category && categoryNameFor(category);

  let title = null;
  let subtitle = null;

  if (feature.properties) {
    subtitle = feature.properties.name ? categoryName : null;
    title = placeNameFor(feature.properties, category);
  }

  return (
    <FocusTrap>
      <div className={className}>
        <ErrorBoundary>
          {photoSectionElement}
          <DetailPanelHeader
            title={title}
            subtitle={subtitle}
            icon={iconElement}
            onCloseButtonClick={onClose}
          />
          <DetailPanelMain>
            {accessibilitySectionElement}
            {iconButtonListElement}
          </DetailPanelMain>
          {a11yDetailsElement}
          <footer>
            {sourcePraiseElement}
            {sourceDisclaimerElement}
          </footer>
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
    padding: 0;

    .link-button,
    .expand-button {
      box-sizing: border-box;
      margin: 0;
      padding: 10px;
      height: 74px;
      width: 100%;
    }

    .link-button {
      svg {
        margin-left: 0;
      }
    }

    button.link-button {
      svg {
        margin-left: -0.3rem;
        margin-right: 1rem;
      }
    }

    .expand-button {
      font-size: 1rem;
      svg {
        margin-left: -0.2rem;
        margin-right: 0.9rem;
      }
    }

    footer {
      flex-wrap: nowrap;
    }
  }

  ${PhotoSection} {
    margin-left: -0.5rem;
    margin-right: -0.5rem;

    ${ChromelessButton}:hover {
      background-color: transparent;
    }
  }

  ${SourcePraise} {
    margin-top: 6rem;
    text-align: center;
  }

  ${AccessibilitySourceDisclaimer} {
    margin-top: 2rem;
    text-align: center;
  }
`;
