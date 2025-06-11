import { IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";

import React, { useContext, useState } from "react";
import { AutoEditor } from "~/pages/[placeType]/[id]/_components/AutoEditor";
import { FeaturePanelContext } from "../../FeaturePanelContext";

export function EditButton({
  tagKey,
  addNewLanguage,
}: { tagKey: string; addNewLanguage: boolean }): JSX.Element {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={t("Edit")}
        tabIndex={-1}
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
