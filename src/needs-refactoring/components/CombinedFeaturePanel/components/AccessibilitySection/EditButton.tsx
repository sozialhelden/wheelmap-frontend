import { IconButton } from "@radix-ui/themes";
import { Pencil } from "lucide-react";

import React, { useContext, useState } from "react";
import { AutoEditor } from "~/needs-refactoring/modules/edit/components/AutoEditor";
import { FeaturePanelContext } from "../../FeaturePanelContext";

export function EditButton({
  tagKey,
  addNewLanguage,
  ariaLabel,
}: {
  tagKey: string;
  addNewLanguage: boolean;
  ariaLabel: string;
}): JSX.Element {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        variant="soft"
        onClick={() => setIsDialogOpen(true)}
        data-testid={tagKey}
      >
        <Pencil size={18} aria-hidden />
      </IconButton>
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
