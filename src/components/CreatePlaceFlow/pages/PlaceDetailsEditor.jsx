// @flow
import * as React from 'react';
import { t } from 'ttag';

import VerticalPage from '../components/VerticalPage';
import MapButton from '../components/MapButton';
import AddressEditor from '../components/AddressEditor';
import type { AddressData } from '../components/AddressEditor';
import type { PointGeometry } from './PointGeometryPicker';
import { ChromelessButton, PrimaryButton } from '../../Button';
import PageHeader from '../components/PageHeader.jsx';
import styled from 'styled-components';
import InputField, { sharedInputStyle } from '../components/InputField';
import { viewportFromSavedState } from '../pages/PointGeometryPicker';
import colors from '../../../lib/colors';

export type PlaceData = {
  properties: {
    name: string,
    category?: string,
    address: AddressData,
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
      onUpdateName(e.target.value);
    },
    [onUpdateName]
  );

  if (!visible) {
    return null;
  }

  const hasName = !!place.properties.name;
  const hasGeometry = !!place.geometry;
  const hasCategory = !!place.properties.category;
  const canSubmit = !hasGeometry || !hasCategory || !hasName;

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
            {place.properties.category || t`Select category`}
          </button>
        </>
      )}
      <pre>{JSON.stringify(place, null, 2)}</pre>
      <PrimaryButton disabled={canSubmit} onClick={onSubmit}>
        {t`Continue`}
      </PrimaryButton>
    </VerticalPage>
  );
};

export default styled(PlaceDetailsEditor)`
  > ${InputField}, > ${MapButton}, > label {
    margin-top: 12px;
  }

  > label {
    font-weight: bold;
    color: ${colors.textMuted};
  }

  .category-pick-button {
    margin-top: 12px;
    appearance: none;
    background: transparent;
    text-align: left;
    ${sharedInputStyle}
  }
`;
