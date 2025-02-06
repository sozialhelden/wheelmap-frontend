import React, { useContext } from "react";
import { FeaturePanelContext } from "../../../../components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "../../../../components/CombinedFeaturePanel/PlaceLayout";
import { ToiletsWheelchairEditor } from "../../../../components/CombinedFeaturePanel/editors/ToiletsWheelchairEditor";

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return (
    <ToiletsWheelchairEditor feature={feature} tagKey="toilets:wheelchair" />
  );
}

ToiletAccessibility.getLayout = getLayout;

export default ToiletAccessibility;
