import React, { useContext } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { WheelchairEditorOld } from "~/modules/edit/components/WheelchairEditorOld";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];
  return <WheelchairEditorOld feature={feature} tagKey="wheelchair" />;
}

WheelchairAccessibility.getLayout = getLayout;

export default WheelchairAccessibility;
