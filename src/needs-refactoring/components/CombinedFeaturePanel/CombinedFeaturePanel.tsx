import { Box, Callout } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { uniqBy } from "lodash";
import React from "react";
import FeatureDetails from "~/modules/edit/components/FeatureDetails";
import ErrorBoundary from "~/needs-refactoring/components/shared/ErrorBoundary";
import {
  type AnyFeature,
  isSearchResultFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { useExpertMode } from "~/needs-refactoring/lib/useExpertMode";
import FeaturesDebugJSON from "./components/FeaturesDebugJSON";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

export function CombinedFeaturePanel(props: Props) {
  const features = uniqBy(props.features, (feature) =>
    isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id,
  );

  const { isExpertMode } = useExpertMode();

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Box>
          {features[0] && (
            <FeatureDetails
              features={features}
              activeImageId={props.activeImageId}
              isUploadDialogOpen={props.isUploadDialogOpen}
            />
          )}

          {(!features || features.length === 0) && (
            <Callout.Root mt="9">
              <Callout.Text>{t("No features found.")}</Callout.Text>
            </Callout.Root>
          )}

          <p>{isExpertMode && <FeaturesDebugJSON features={features} />}</p>
        </Box>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
