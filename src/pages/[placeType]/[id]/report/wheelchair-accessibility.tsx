import React, { useContext } from "react";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "~/components/CombinedFeaturePanel/PlaceLayout";
import { WheelchairEditor } from "~/domains/edit/components/WheelchairEditor";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
