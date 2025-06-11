import { Source } from "react-map-gl/mapbox";
import { useAccessibilityCloudApiCollectionTileUrl } from "~/hooks/useAccessibilityCloudApi";

export const AcPoiLayers = () => {
  const tiles = [
    useAccessibilityCloudApiCollectionTileUrl({ collection: "place-infos" }),
  ];

  return (
    <>
      <Source
        type="vector"
        tiles={tiles}
        id="ac:PlaceInfo"
        scheme="xyz"
        minzoom={8}
      />
    </>
  );
};
