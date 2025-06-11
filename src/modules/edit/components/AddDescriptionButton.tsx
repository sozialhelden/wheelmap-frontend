import { Pencil } from "lucide-react";
import React, { type ReactNode, useContext, useState } from "react";

import { SecondaryButton } from "~/components/button/SecondaryButton";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import DescriptionEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/DescriptionEditor";

interface Props {
  tagKey: string;
  children: ReactNode;
}

export function AddDescriptionButton({ tagKey, children }: Props) {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <SecondaryButton
        size="2"
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        <Pencil size={18} aria-hidden />
        {children}
      </SecondaryButton>

      {isDialogOpen && feature && (
        <DescriptionEditor
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          feature={feature}
          tagKey={tagKey}
          addNewLanguage={true}
        />
      )}
    </>
  );
}
