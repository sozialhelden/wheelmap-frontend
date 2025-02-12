import { useHotkeys } from "@blueprintjs/core";
import { Box, Callout, Flex, Inset, Separator } from "@radix-ui/themes";
import { uniqBy } from "lodash";
import React, { useMemo, useState } from "react";
import { t } from "ttag";
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
    return null;
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

  return null;
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
        <Flex
          gap="4"
          direction="column"
          align="stretch"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          {features[0] && (
            <PlaceOfInterestDetails
              feature={features[0]}
              activeImageId={props.activeImageId}
              isUploadDialogOpen={props.isUploadDialogOpen}
            />
          )}

          {surroundings?.map((feature) => (
            <>
              <Inset side="x" key={`${getKey(feature)}-separator`}>
                <Separator orientation="horizontal" size="4" />
              </Inset>
              <Box key={getKey(feature)}>
                <FeatureSection feature={feature} />
              </Box>
            </>
          ))}

          {(!features || features.length === 0) && (
            <Callout.Root>
              <Callout.Text>{t`No features found.`}</Callout.Text>
            </Callout.Root>
          )}

          {showDebugger && <FeaturesDebugJSON features={features} />}
        </Flex>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
