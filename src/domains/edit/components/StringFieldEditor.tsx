import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Callout,
  Dialog,
  Flex,
  Text,
  TextArea,
  VisuallyHidden,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAvailableLangTags,
  normalizeAndExtractLanguageTagsIfPresent,
} from "~/needs-refactoring/components/CombinedFeaturePanel/utils/TagKeyUtils";
import SearchableSelect from "~/needs-refactoring/components/shared/SearchableSelect";
import { supportedLanguageTagsOptions } from "~/modules/i18n/i18n";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";

export const StringFieldEditor: React.FC<BaseEditorProps> = ({
  feature,
  tagKey,
  addNewLanguage,
  onChange,
  onSubmit,
  onLanguageChange,
  onClose,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  if (!tagKey) {
    throw new Error("Editing a tag value works only with a defined tag key.");
  }

  const { normalizedOSMTagKey: tagKeyWithoutLangTag } =
    normalizeAndExtractLanguageTagsIfPresent(tagKey);
  const initialTagValue = feature.properties?.[tagKey] ?? "";

  const descriptionKeys = Object.keys(feature.properties ?? {}).filter((key) =>
    key.startsWith(tagKeyWithoutLangTag),
  );
  const availableLangTags = getAvailableLangTags(
    descriptionKeys,
    tagKeyWithoutLangTag.split(":").length,
  );

  const [currentTagValue, setCurrentTagValue] = useState(initialTagValue);
  const [editedTagValue, setEditedTagValue] = useState(initialTagValue);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] = useState(true);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const dialogDescription = addNewLanguage
    ? tagKey.includes("wheelchair:description")
      ? t(
          "Please describe how accessible this place is for wheelchair users. Start by selecting the language for your description.",
        )
      : t(
          "Please describe this place. Start by selecting the language for your description.",
        )
    : t("Please edit this description in the same language.");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const initialValue = useMemo(() => {
    if (availableLangTags.has(selectedLanguage)) {
      const newTagKey = `${tagKeyWithoutLangTag}:${selectedLanguage}`;
      return feature?.properties?.[newTagKey] || "";
    }
    return "";
  }, [
    selectedLanguage,
    availableLangTags,
    feature.properties,
    tagKeyWithoutLangTag,
  ]);

  useEffect(() => {
    setSaveButtonDoesNothing(currentTagValue === editedTagValue);
  }, [currentTagValue, editedTagValue]);

  useEffect(() => {
    setTextAreaValue(initialValue);
    setCurrentTagValue(initialTagValue);
    setEditedTagValue(initialTagValue);
  }, [initialValue, initialTagValue]);

  const handleTextAreaChange = (newValue) => {
    setTextAreaValue(newValue);
    setEditedTagValue(newValue);
    setHasValueChanged(newValue !== initialTagValue);
    onChange?.(newValue);
    textAreaRef.current?.focus();
  };

  // TODO: find a better way to keep the focus on the text area, this approach causes flickering
  useEffect(() => {
    if (!addNewLanguage || hasValueChanged) {
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 0);
    }
  }, [addNewLanguage, hasValueChanged]);

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Content data-testid={`dialog_${tagKey}`}>
        <Flex direction="column" gap="3">
          <FeatureNameHeader feature={feature}>
            {feature["@type"] === "osm:Feature" && (
              <FeatureImage feature={feature} />
            )}
          </FeatureNameHeader>
          <VisuallyHidden asChild>
            <Dialog.Title>{`Editing ${tagKey}`}</Dialog.Title>
          </VisuallyHidden>

          <Dialog.Description size="3" mb="4" as="div">
            <Flex direction="column" gap="3">
              {dialogDescription}
              {addNewLanguage && (
                <Flex gap="2">
                  <Callout.Root>
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text as="div">
                      {t(
                        "Currently, we support a limited number of languages.",
                      )}
                      <br />
                      {t(
                        "More will be added soon! If your language is missing, please contact our support team.",
                      )}
                    </Callout.Text>
                  </Callout.Root>
                </Flex>
              )}
            </Flex>
          </Dialog.Description>
        </Flex>

        <Flex direction="column" gap="3" style={{ width: "100%" }}>
          {addNewLanguage && (
            <Flex align="center" gap="3" style={{ width: "100%" }}>
              <Text as="label" size="2">
                {t("Select a language:")}
              </Text>
              <Flex style={{ flexGrow: 1 }}>
                <SearchableSelect
                  data-testid="searchable-select"
                  selectPlaceholder={t("Languages")}
                  items={supportedLanguageTagsOptions}
                  onSelect={(value) => {
                    setSelectedLanguage(value);
                    if (onLanguageChange) {
                      onLanguageChange(value);
                      if (!hasValueChanged) {
                        setHasValueChanged(true);
                      }
                    }
                  }}
                  ariaLabelForTrigger={t("Select a language")}
                  ariaLabelForContent={t("List of languages")}
                />
              </Flex>
            </Flex>
          )}

          <div hidden={addNewLanguage ? !hasValueChanged : false}>
            <TextArea
              dir="auto"
              ref={textAreaRef}
              aria-label={t("Enter a description here")}
              defaultValue={addNewLanguage ? undefined : initialTagValue}
              value={addNewLanguage ? textAreaValue : undefined}
              placeholder={t("Enter a description here")}
              onChange={(evt) => handleTextAreaChange(evt.target.value)}
              size="2"
              radius="small"
              variant="classic"
            />
          </div>

          <Flex gap="3" mt="4" justify="end">
            <SecondaryButton onClick={onClose}>{t("Cancel")}</SecondaryButton>
            <PrimaryButton onClick={saveButtonDoesNothing ? onClose : onSubmit}>
              {saveButtonDoesNothing ? t("Confirm") : t("Send")}
            </PrimaryButton>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
