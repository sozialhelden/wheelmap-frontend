import { useHotkeys } from "@blueprintjs/core";
import { Box, Callout } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { uniqBy } from "lodash";
import React, { useMemo, useState } from "react";
import {
  type AnyFeature,
  getKey,
  isOSMFeature,
  isSearchResultFeature,
} from "../../lib/model/geo/AnyFeature";
import ErrorBoundary from "../shared/ErrorBoundary";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";
import OSMBuildingDetails from "./type-specific/building/OSMBuildingDetails";
import PlaceOfInterestDetails from "./type-specific/poi/PlaceOfInterestDetails";
import OSMSidewalkDetails from "./type-specific/surroundings/OSMSidewalkDetails";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

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

export function CombinedFeaturePanel(props: Props) {
  const features = uniqBy(props.features, (feature) =>
    isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id,
  );

  const [showDebugger, setShowDebugger] = useState(false);
  const hotkeys = useMemo(
    () => [
      {
        combo: "j",
        global: true,
        label: "Show JSON Feature Debugger",
        onKeyDown: () => setShowDebugger(!showDebugger),
      },
    ],
    [showDebugger],
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);
  const surroundings = features?.length > 1 ? features.slice(1) : undefined;

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Box onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
          {features[0] && (
            <PlaceOfInterestDetails
              feature={features[0]}
              activeImageId={props.activeImageId}
              isUploadDialogOpen={props.isUploadDialogOpen}
            />
          )}
          {surroundings?.map((feature) => (
            <FeatureSection key={getKey(feature)} feature={feature} />
          ))}

          {(!features || features.length === 0) && (
            <Callout.Root>
              <Callout.Text>{t("No features found.")}</Callout.Text>
            </Callout.Root>
          )}

          <p>{showDebugger && <FeaturesDebugJSON features={features} />}</p>
        </Box>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
