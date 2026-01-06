import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import DescriptionEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/DescriptionEditor";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

type Props = {
  tagKey: string;
  tagValue: string | undefined | number;
  feature: AnyFeature;
} & React.ComponentPropsWithoutRef<"button">;

const EditDescriptionDropdownMenu = ({
  tagKey,
  tagValue,
  feature,
  ...triggerProps
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addNewLanguage, setAddNewLanguage] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <IconButton
            ref={buttonRef}
            {...triggerProps}
            variant="soft"
            size="2"
            data-testid={`edit-description__button--${tagKey}`}
            aria-label={t("Edit description")}
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
            data-testid={`edit-description__menu__current-language--${tagKey}`}
          >
            {t("Edit this description")}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => {
              setIsDialogOpen(true);
              setAddNewLanguage(true);
            }}
            data-testid={`edit-description__menu__new-language--${tagKey}`}
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

export default EditDescriptionDropdownMenu;
