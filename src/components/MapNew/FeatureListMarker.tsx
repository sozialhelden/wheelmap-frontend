import React from 'react';
import { MapContext } from 'react-map-gl';
import { FeatureId } from '../../model/Feature';

type Props = {
  featureIds: FeatureId[];
  latitude: number;
  longitude: number;
};

export default function FeatureListMarker(props: Props) {
  const context = React.useContext(MapContext);
  const { longitude, latitude } = props;
  if (!context.viewport) {
    return null;
  }
  const [x, y] = context.viewport.project([longitude, latitude]);

  return (
    <div
      style={{
        position: 'absolute',
        background: '#fff',
        left: x,
        top: y,
      }}
    >
      (
      {longitude}
      ,
      {' '}
      {latitude}
      )
    </div>
  );
}
