import React, { useContext } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { WheelchairEditor } from "~/domains/edit/components/WheelchairEditor";
import { getLayout } from "~/components/layouts/DefaultLayout";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
