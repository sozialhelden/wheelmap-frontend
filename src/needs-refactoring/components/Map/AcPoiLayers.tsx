import { Source } from "react-map-gl/mapbox";
import { useAccessibilityCloudCollectionTileUrl } from "~/modules/accessibility-cloud/hooks/useAccessibilityCloudCollectionTileUrl";
import { useAccessibilityCloudFilterQuery } from "~/modules/accessibility-cloud/hooks/useAccessibilityCloudFilterQuery";

export const AcPoiLayers = () => {
  const params = useAccessibilityCloudFilterQuery();

  const tiles = [
    useAccessibilityCloudCollectionTileUrl({
      collection: "place-infos",
      params,
    }),
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
