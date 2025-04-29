import React from "react";
import {
  type AnyFeature,
  isOSMFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import OSMBuildingDetails from "~/needs-refactoring/components/CombinedFeaturePanel/type-specific/building/OSMBuildingDetails";
import OSMSidewalkDetails from "~/needs-refactoring/components/CombinedFeaturePanel/type-specific/surroundings/OSMSidewalkDetails";
import { bbox } from "@turf/turf";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import { useMap } from "~/needs-refactoring/components/Map/useMap";
import styled from "styled-components";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

const HeaderImage = styled.div`
    width: calc(100% + var(--space-3) * 2); 
    height: 15rem; 
    margin-left: calc(-1 * var(--space-3)); 
    margin-right: calc(-1 * var(--space-3)); 
    background: lightgray;
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    
  `;

function FeatureSection({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature)) {
    return <section>Feature type not supported</section>;
  }

  if (feature.properties.building) {
    return <OSMBuildingDetails feature={feature} />;
  }

  if (
    feature.properties.highway === "footway" ||
    feature.properties.highway === "pedestrian"
  ) {
    return <OSMSidewalkDetails feature={feature} />;
  }

  return (
    <section>
      <h2>Feature type not supported</h2>
    </section>
  );
}

const FeaturePanel = ({ features }: Props) => {
  const feature = features[0];
  const map = useMap();

  const handleHeaderClick = () => {
    console.log(feature.geometry?.coordinates);
    const coordinates = feature.geometry?.coordinates;
    if (!coordinates) {
      return;
    }

    const cameraOptions = map?.map?.cameraForBounds(bbox(feature), {
      maxZoom: 19,
    });
    if (cameraOptions) {
      map?.map?.flyTo({
        ...cameraOptions,
        duration: 1000,
        padding: 100,
      });
    }
    // map.current?.flyTo({ center: { ...feature.geometry?.coordinates } })
  };

  console.log("feature", feature);

  return (
    <>
      <HeaderImage>
        {feature && feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </HeaderImage>

      {feature && (
        <FeatureNameHeader
          feature={feature}
          onHeaderClicked={handleHeaderClick}
        />
      )}
    </>
  );
};

export default FeaturePanel;
