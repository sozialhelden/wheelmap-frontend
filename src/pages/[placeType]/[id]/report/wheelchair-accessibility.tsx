import React, { useContext } from "react";
import { WheelchairEditor } from "~/domains/edit/components/WheelchairEditor";
import { FeaturePanelContext } from "../../../../components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "../../../../components/CombinedFeaturePanel/PlaceLayout";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
