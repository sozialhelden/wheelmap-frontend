import React from "react";
import {
  type AnyFeature,
  getKey,
  isOSMFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import OSMBuildingDetails from "~/needs-refactoring/components/CombinedFeaturePanel/type-specific/building/OSMBuildingDetails";
import OSMSidewalkDetails from "~/needs-refactoring/components/CombinedFeaturePanel/type-specific/surroundings/OSMSidewalkDetails";

interface Props {
  features: AnyFeature[];
}

export function SurroundingsSection({ feature }: { feature: AnyFeature }) {
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

const PartOf = ({ features }: Props) => {
  const surroundings = features?.length > 1 ? features.slice(1) : undefined;

  return surroundings?.map((feature) => (
    <SurroundingsSection key={getKey(feature)} feature={feature} />
  ));
};
export default PartOf;
