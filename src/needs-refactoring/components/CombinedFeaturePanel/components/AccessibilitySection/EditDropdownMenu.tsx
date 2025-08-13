import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import DescriptionEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/DescriptionEditor";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { dispatchKeydownEvent } from "~/utils/dispatchKeydownEvent";

type Props = {
  tagKey: string;
  tagValue: string | undefined | number;
  feature: AnyFeature;
} & React.ComponentPropsWithoutRef<"button">;

const EditDropdownMenu = ({
  tagKey,
  tagValue,
  feature,
  ...triggerProps
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addNewLanguage, setAddNewLanguage] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton
            ref={buttonRef}
            {...triggerProps}
            variant="soft"
            size="2"
            data-testid={`${tagKey}`}
            aria-label={t("Edit description")}
            // VoiceOver’s click command fires a plain click event but radix dropdownMenu opens the menu on keydown or
            // pointerdown and it does not react to a click
            onClick={() => dispatchKeydownEvent(buttonRef)}
          >
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
