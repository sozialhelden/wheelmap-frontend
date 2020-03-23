// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';
import AddressEditor from '../components/AddressEditor';
import type { AddressData } from '../components/AddressEditor';
import type { PointGeometry } from './PointGeometryPicker';

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
      PlaceDetailsEditor
      <pre>{JSON.stringify(place, null, 2)}</pre>
      <button onClick={onCancel}>Cancel</button>
      Name
      <input value={place.properties.name} onChange={onPlaceNameChanged} type="text" />
      <button onClick={onPickPointGeometry}>Select Coordinates</button>
      {hasGeometry && (
        <>
          <AddressEditor address={place.properties.address} onUpdateAddress={onUpdateAddress} />
          <button onClick={onPickCategory}>Select Category</button>
        </>
      )}
      <button disabled={canSubmit} onClick={onSubmit}>
        Done
      </button>
    </VerticalPage>
  );
};

export default PlaceDetailsEditor;
