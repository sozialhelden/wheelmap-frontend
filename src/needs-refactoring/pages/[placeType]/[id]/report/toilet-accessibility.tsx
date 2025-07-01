import React, { useContext } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { ToiletsWheelchairEditorOld } from "~/pages/[placeType]/[id]/_components/ToiletsWheelchairEditorOld";

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return (
    <ToiletsWheelchairEditorOld feature={feature} tagKey="toilets:wheelchair" />
  );
}

ToiletAccessibility.getLayout = getLayout;

export default ToiletAccessibility;
