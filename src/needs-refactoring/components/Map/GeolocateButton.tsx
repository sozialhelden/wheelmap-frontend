import type { FC } from "react";
import { GeolocateControl } from "react-map-gl/mapbox";

// TODO: add back custom icon for iOS
export const GeolocateButton: FC = () => {
  return (
    <>
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation
        position="bottom-right"
      />
    </>
  );
};
