import React, { useContext } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { WheelchairEditorOld } from "~/pages/[placeType]/[id]/_components/WheelchairEditorOld";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditorOld feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
