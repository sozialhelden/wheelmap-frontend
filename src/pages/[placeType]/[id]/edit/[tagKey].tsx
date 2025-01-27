import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FeaturePanelContext } from "../../../../components/CombinedFeaturePanel/FeaturePanelContext";
import { getLayout } from "../../../../components/CombinedFeaturePanel/PlaceLayout";
import { AutoEditor } from "../../../../components/CombinedFeaturePanel/editors/AutoEditor";

export default function EditPage() {
  const {
    query: { tagKey, newLang },
  } = useRouter();
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0].feature?.requestedFeature;
  const key = Array.isArray(tagKey) ? tagKey[0] : tagKey;
  const addingNewLanguage = newLang === "true";

  return feature && (
    <AutoEditor
      tagKey={key}
      feature={feature}
      addingNewLanguage={addingNewLanguage}
    />
  );
}

EditPage.getLayout = getLayout;
