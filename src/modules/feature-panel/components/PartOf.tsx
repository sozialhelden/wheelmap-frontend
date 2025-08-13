import React from "react";
import {
  type AnyFeature,
  getKey,
  isOSMFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import OSMBuildingDetails from "~/needs-refactoring/components/CombinedFeaturePanel/type-specific/building/OSMBuildingDetails";
import { t } from "@transifex/native";
import { Heading } from "@radix-ui/themes";

interface Props {
  surroundings: AnyFeature[];
}

export function SurroundingsSection({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature)) {
    return <section>Feature type not supported</section>;
  }

  if (feature.properties.building) {
    return <OSMBuildingDetails feature={feature} />;
  }

  // sidewalks and surroundings need a proper concept
  // if (
  //   feature.properties.highway === "footway" ||
  //   feature.properties.highway === "pedestrian"
  // ) {
  //   return <OSMSidewalkDetails feature={feature} />;
  // }
}

const PartOf = ({ surroundings }: Props) => {
  return (
    <>
      <Heading size="2" mb="1">
        {t("Part of")}
      </Heading>
      {surroundings?.map((feature) => (
        <SurroundingsSection key={getKey(feature)} feature={feature} />
      ))}
    </>
  );
};
export default PartOf;
