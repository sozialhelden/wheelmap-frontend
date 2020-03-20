// @flow
import * as React from 'react';

type Props = {
  visible: boolean,
  place: {},
  onCancel: () => void,
  onPickPointGeometry: () => void,
  onPickCategory: () => void,
  onSubmit: () => void,
};

const PlaceDetailsEditor = (props: Props) => {
  const { visible, place, onCancel, onPickPointGeometry, onPickCategory, onSubmit } = props;

  if (!visible) {
    return null;
  }

  return (
    <>
      PlaceDetailsEditor
      <code>{JSON.stringify(place)}</code>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onPickPointGeometry}>Select Coordinates</button>
      <button onClick={onPickCategory}>Select Category</button>
      <button onClick={onSubmit}>Done</button>
    </>
  );
};

export default PlaceDetailsEditor;
