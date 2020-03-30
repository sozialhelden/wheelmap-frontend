// @flow

import * as React from 'react';
import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';

import ErrorBoundary from '../ErrorBoundary';
import PhotoHeader from './PhotoHeader';

import { type Feature } from '../../lib/Feature';
import { placeNameFor } from '../../lib/Feature';
import Categories, { type CategoryLookupTables, categoryNameFor } from '../../lib/Categories';
import DetailPanelHeader from './DetailPanelHeader';
import DetailPanelMain from './DetailPanelMain';
import SourcePraise from './SourcePraise';
import IconButtonList from '../NodeToolbar/IconButtonList/IconButtonList';
import AccessibilitySourceDisclaimer from '../NodeToolbar/AccessibilitySection/AccessibilitySourceDisclaimer';
import WheelchairAndToiletAccessibility from '../NodeToolbar/AccessibilitySection/WheelchairAndToiletAccessibility';
import A11yDetails from './A11yDetails';
import { ChromelessButton } from '../Button';

type Props = {
  className?: string,
  feature: Feature,
  categories: CategoryLookupTables,
  onClose: () => void,
  iconElement: React.Node,
  accessibilitySectionElement: React.Node,
  iconButtonListElement: React.Node,
  photoHeaderElement: React.Node,
  photoUploadButtonElement: React.Node,
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
  photoHeaderElement,
  photoUploadButtonElement,
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
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: () => true }}>
      <div className={className}>
        <ErrorBoundary>
          {photoHeaderElement}
          <DetailPanelHeader
            title={title}
            subtitle={subtitle}
            icon={iconElement}
            photoUploadButtonElement={photoUploadButtonElement}
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
  hyphens: auto;

  footer {
    margin-bottom: 2rem;
  }

  ${IconButtonList} {
    padding: 0;

    .link-button,
    .expand-button {
      box-sizing: border-box;
      margin: 0;
      padding: 10px;
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
      margin-bottom: 0;
    }
  }

  ${PhotoHeader} {
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

  ${WheelchairAndToiletAccessibility} {
    > button {
      margin: 0;
    }
  }

  ${A11yDetails} {
    dl.ac-group {
      margin: 0 !important; /* unfortunate, but another !important forces me to use !important here  */
    }
  }
`;
