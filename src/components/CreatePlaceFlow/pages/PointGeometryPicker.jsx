// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';

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
    <VerticalPage>
      PointGeometryPicker
      <button onClick={() => onSelected({ type: 'Point', coordinates: [13, 53] })}>
        Select Geometry
      </button>
      <button onClick={onCancel}>Cancel</button>
    </VerticalPage>
  );
};

export type PointGeometry = {
  type: 'Point',
  coordinates: [number, number],
};

export default PointGeometryPicker;
