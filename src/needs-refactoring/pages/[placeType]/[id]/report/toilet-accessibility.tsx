import React, { useContext } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { ToiletsWheelchairEditor } from "~/pages/[placeType]/[id]/_components/ToiletsWheelchairEditor";

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return (
    <ToiletsWheelchairEditor feature={feature} tagKey="toilets:wheelchair" />
  );
}

ToiletAccessibility.getLayout = getLayout;

export default ToiletAccessibility;
