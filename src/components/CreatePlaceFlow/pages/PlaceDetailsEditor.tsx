import * as React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import colors from '../../../lib/colors';

import Icon from '../../Icon';
import { ChromelessButton, PrimaryButton } from '../../Button';

import VerticalPage from '../components/VerticalPage';
import MapButton from '../components/MapButton';
import AddressEditor from '../components/AddressEditor';
import type { AddressData } from '../components/AddressEditor';
import PageHeader from '../components/PageHeader';
import InputField, { sharedInputStyle } from '../components/InputField';

import { viewportFromSavedState } from './PointGeometryPicker';
import type { PointGeometry } from './PointGeometryPicker';
import AppContext from '../../../AppContext';
import { categoryNameFor } from '../../../lib/Categories';

export type PlaceData = {
  properties: {
    name: string,
    category?: string,
    address: AddressData,
    originalId?: string,
    originalData?: string,
    accessibility: {},
  },
  geometry?: PointGeometry,
};

type Props = {
  className?: string,
  visible: boolean,
  place: PlaceData,
  onCancel: () => void,
  onUpdateName: (name: string) => void,
  onUpdateAddress: (address: AddressData) => void,
  onPickPointGeometry: () => void,
  onPickCategory: () => void,
  onSubmit: () => void,
};

const PlaceDetailsEditor = (props: Props) => {
  const {
    className,
    visible,
    place,
    onCancel,
    onPickPointGeometry,
    onPickCategory,
    onUpdateAddress,
    onUpdateName,
    onSubmit,
  } = props;

  const onPlaceNameChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      onUpdateName(e.target['value']);
    },
    [onUpdateName]
  );

  const appContext = React.useContext(AppContext);
  const categoryTree = appContext.categories.categoryTree;
  const placeCategoryId = place.properties.category;

  const category = React.useMemo(() => {
    if (!placeCategoryId) {
      return null;
    } else {
      return categoryTree.find(c => c._id === placeCategoryId);
    }
  }, [categoryTree, placeCategoryId]);

  if (!visible) {
    return null;
  }

  const hasName = !!place.properties.name;
  const hasGeometry = !!place.geometry;
  const hasValidCategory = !!place.properties.category;
  const canSubmit = !hasGeometry || !hasValidCategory || !hasName;

  const viewport = viewportFromSavedState();

  return (
    <VerticalPage className={className}>
      <PageHeader>
        <ChromelessButton onClick={onCancel}>{t`Cancel`}</ChromelessButton>
        <h2>{t`Create Place`}</h2>
      </PageHeader>
      <label>{t`Name`}</label>
      <InputField value={place.properties.name} onChange={onPlaceNameChanged} type="text" />

      <MapButton
        onClick={onPickPointGeometry}
        category={place.properties.category}
        latitude={place.geometry ? place.geometry.coordinates[1] : viewport.latitude || 0}
        longitude={place.geometry ? place.geometry.coordinates[0] : viewport.longitude || 0}
      />

      {hasGeometry && (
        <>
          <AddressEditor address={place.properties.address} onUpdateAddress={onUpdateAddress} />
          <label>{t`Category`}</label>
          <button className="category-pick-button" onClick={onPickCategory}>
            {!hasValidCategory && <span>{t`Select category`}</span>}
            {hasValidCategory && (
              <>
                <Icon
                  withArrow={false}
                  category={place.properties.category}
                  ariaHidden={true}
                  size="medium"
                  accessibility={'yes'}
                  backgroundColor={colors.darkLinkColor}
                />
                <span>{categoryNameFor(category) || category._id}</span>
              </>
            )}
          </button>
        </>
      )}
      <footer>
        <PrimaryButton disabled={canSubmit} onClick={onSubmit}>
          {t`Continue`}
        </PrimaryButton>
      </footer>
    </VerticalPage>
  );
};

export default styled(PlaceDetailsEditor)`
  & > label,
  & > ${MapButton}, & > ${InputField} {
    margin-top: 12px;
  }

  & > footer {
    padding-bottom: 24px;
    padding-top: 24px;
  }

  & > label {
    font-weight: bold;
    color: ${colors.textMuted};
  }

  .category-pick-button {
    margin-top: 12px;
    appearance: none;
    background: transparent;
    text-align: left;
    ${sharedInputStyle}
    min-height: 60px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;

    > figure {
      margin-right: 12px;
    }

    > span {
      font-weight: bold;
    }

    &:hover {
      background: ${colors.selectedColor};
    }
  }

  ${ChromelessButton} {
    font-weight: bold;
    color: ${colors.linkColor};
  }
`;
