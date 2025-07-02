import React, { useContext } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { WheelchairEditor } from "~/modules/edit/components/WheelchairEditor";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
