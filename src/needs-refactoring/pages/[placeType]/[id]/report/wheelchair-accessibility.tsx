import React, { useContext } from "react";
import { getLayout } from "~/components/layouts/DefaultLayout";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { WheelchairEditor } from "~/pages/[placeType]/[id]/_components/WheelchairEditor";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
