import { Pencil1Icon } from "@radix-ui/react-icons";
import React, { type ReactNode, useContext, useState } from "react";
import { AutoEditor } from "~/domains/edit/components/AutoEditor";

import { SecondaryButton } from "~/components/button/SecondaryButton";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

interface Props {
  tagKey: string;
  children: ReactNode;
}

export function AddDescriptionButton({ tagKey, children }: Props) {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addNewLanguage, setAddNewLanguage] = useState(false);

  return (
    <>
      <SecondaryButton
        size="2"
        onClick={() => {
          setIsDialogOpen(true);
          setAddNewLanguage(true);
        }}
      >
        <Pencil1Icon width="18" height="18" />
        {children}
      </SecondaryButton>

      {isDialogOpen && feature && (
        <AutoEditor
          feature={feature}
          tagKey={tagKey}
          addNewLanguage={addNewLanguage}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
