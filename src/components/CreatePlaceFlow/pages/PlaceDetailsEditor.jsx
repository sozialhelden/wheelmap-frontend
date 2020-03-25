// @flow
import * as React from 'react';
import { t } from 'ttag';

import VerticalPage from '../components/VerticalPage';
import AddressEditor from '../components/AddressEditor';
import type { AddressData } from '../components/AddressEditor';
import type { PointGeometry } from './PointGeometryPicker';
import { ChromelessButton, PrimaryButton } from '../../Button';
import PageHeader from '../components/PageHeader.jsx';
import styled from 'styled-components';
import InputField from '../components/InputField';

export type PlaceData = {
  properties: {
    name: string,
    category?: string,
    address: AddressData,
  },
  geometry?: PointGeometry,
};

type Props = {
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

  return (
    <VerticalPage>
      <PageHeader>
        <ChromelessButton onClick={onCancel}>{t`Cancel`}</ChromelessButton>
        <h2>{t`Create Place`}</h2>
      </PageHeader>
      <pre>{JSON.stringify(place, null, 2)}</pre>
      <label>{t`Name`}</label>
      <InputField value={place.properties.name} onChange={onPlaceNameChanged} type="text" />
      <button onClick={onPickPointGeometry}>Select Coordinates</button>
      {hasGeometry && (
        <>
          <AddressEditor address={place.properties.address} onUpdateAddress={onUpdateAddress} />
          <label>{t`Category`}</label>
          <button onClick={onPickCategory}>
            {place.properties.category || t`Select category`}
          </button>
        </>
      )}
      <PrimaryButton disabled={canSubmit} onClick={onSubmit}>
        {t`Continue`}
      </PrimaryButton>
    </VerticalPage>
  );
};

export default styled(PlaceDetailsEditor)``;
