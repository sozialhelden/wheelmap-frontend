import { Pencil1Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { t } from "ttag";

import React, { useContext, useState } from "react";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import { AutoEditor } from "../../editors/AutoEditor";

export function EditButton({ tagKey }: { tagKey: string }) {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <IconButton
        aria-label={t`Edit`}
        tabIndex={-1}
        variant="soft"
        onClick={handleEditClick}
      >
        <Pencil1Icon width="18" height="18" />
      </IconButton>
      {isDialogOpen && feature && (
        <AutoEditor
          feature={feature}
          tagKey={tagKey}
          addingNewLanguage={false}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
