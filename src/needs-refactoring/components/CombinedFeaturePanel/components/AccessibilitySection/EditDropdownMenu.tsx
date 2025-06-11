import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import DescriptionEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/DescriptionEditor";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

type Props = {
  tagKey: string;
  tagValue: string | undefined;
  feature: AnyFeature;
};
const EditDropdownMenu = ({ tagKey, tagValue, feature }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addNewLanguage, setAddNewLanguage] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="soft" size="2" data-testid={`${tagKey}`}>
            <Pencil size={18} aria-hidden />
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
            {t("Edit this description")}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => {
              setIsDialogOpen(true);
              setAddNewLanguage(true);
            }}
            data-testid="new-language"
          >
            {t("Add a description in another language")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {isDialogOpen && feature && (
        <DescriptionEditor
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          feature={feature}
          tagKey={tagKey}
          tagValue={tagValue}
          addNewLanguage={addNewLanguage}
        />
      )}
    </>
  );
};

export default EditDropdownMenu;
