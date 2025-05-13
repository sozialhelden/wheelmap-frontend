import React, { useContext } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { ToiletsWheelchairEditor } from "~/modules/edit/components/ToiletsWheelchairEditor";
import { getLayout } from "~/components/layouts/DefaultLayout";

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return (
    <ToiletsWheelchairEditor feature={feature} tagKey="toilets:wheelchair" />
  );
}

ToiletAccessibility.getLayout = getLayout;

export default ToiletAccessibility;
