// @flow

import * as React from 'react';
import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';

import ErrorBoundary from '../ErrorBoundary';
import PhotoSection from './Photos/PhotoSection';

import { Feature, isWheelchairAccessible } from '../../lib/Feature';
import { placeNameFor } from '../../lib/Feature';
import Categories, {
  type CategoryLookupTables,
  getCategoryId,
  categoryNameFor,
} from '../../lib/Categories';
import DetailPanelHeader from './DetailPanelHeader';
import Icon from '../Icon';
import DetailPanelMain from './DetailPanelMain';

type Props = {
  className?: string,
  feature: Feature,
  categories: CategoryLookupTables,
  accessibilitySectionElement: ReactElement,
  iconButtonListElement: ReactElement,
  inlineWheelchairAccessibilityEditorElement: ReactElement,
};

class DetailPanel extends React.Component<Props, State> {
  renderPhotoSection() {
    return (
      <PhotoSection
        featureId={this.props.featureId}
        photos={this.props.photos || []}
        onReportPhoto={this.props.onReportPhoto}
        onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow}
        photoFlowNotification={this.props.photoFlowNotification}
        photoFlowErrorMessage={this.props.photoFlowErrorMessage}
      />
    );
  }

  render() {
    const {
      className,
      feature,
      categories,
      accessibilitySectionElement,
      iconButtonListElement,
      inlineWheelchairAccessibilityEditorElement,
    } = this.props;

    const categoryAndParentCategory = Categories.getCategoriesForFeature(categories, feature);
    const category = categoryAndParentCategory.category || categoryAndParentCategory.parentCategory;
    const categoryName = category && categoryNameFor(category);
    const categoryId = category && getCategoryId(category);

    const accessibility = isWheelchairAccessible(feature.properties);

    const iconElement = (
      <Icon
        accessibility={accessibility}
        category={categoryId || 'undefined'}
        size="big"
        ariaHidden={true}
      />
    );

    let placeName = placeNameFor(feature.properties, category);

    return (
      <FocusTrap>
        <div className={className}>
          <ErrorBoundary>
            {this.renderPhotoSection()}
            <DetailPanelHeader title={placeName} subtitle={categoryName} icon={iconElement} />
            <DetailPanelMain>
              {inlineWheelchairAccessibilityEditorElement}
              {accessibilitySectionElement}
              {iconButtonListElement}
            </DetailPanelMain>
          </ErrorBoundary>
        </div>
      </FocusTrap>
    );
  }
}

export default styled(DetailPanel)`
  position: absolute;
  top: 50px;
  z-index: 1100;
  width: 100%;
  height 100%;
  background-color: #FFFFFF;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  ${PhotoSection} {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
`;
