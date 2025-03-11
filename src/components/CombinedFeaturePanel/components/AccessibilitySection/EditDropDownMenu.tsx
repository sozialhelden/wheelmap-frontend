import { Pencil1Icon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import React, { useContext, useState } from "react";
import { t } from "ttag";
import { AutoEditor } from "~/domains/edit/components/AutoEditor";
import { FeaturePanelContext } from "../../FeaturePanelContext";

export function EditDropdownMenu({ tagKey }: { tagKey: string }) {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addNewLanguage, setAddNewLanguage] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="soft" size="2" data-testid={`${tagKey}`}>
            <Pencil1Icon width="18" height="18" />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={() => {
              setIsDialogOpen(true);
              setAddNewLanguage(false);
            }}
            data-testid="this-language"
          >
            {t`Edit this description`}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => {
              setIsDialogOpen(true);
              setAddNewLanguage(true);
            }}
            data-testid="new-language"
          >
            {t`Add a description in another language`}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

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
