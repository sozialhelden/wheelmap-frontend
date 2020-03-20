// @flow
import * as React from 'react';

type Props = {
  visible: boolean,
  onSelected: (geometry: PointGeometry) => void,
  onCancel: () => void,
};

const PointGeometryPicker = (props: Props) => {
  const { visible, onCancel, onSelected } = props;

  if (!visible) {
    return null;
  }

  return (
    <>
      PointGeometryPicker
      <button onClick={() => onSelected({ type: 'Point', coordinates: [13, 53] })}>
        Select Geometry
      </button>
      <button onClick={onCancel}>Cancel</button>
    </>
  );
};

export type PointGeometry = {
  type: 'Point',
  coordinates: [number, number],
};

export default PointGeometryPicker;
