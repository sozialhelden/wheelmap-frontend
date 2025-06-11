import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import {
  getAvailableLangTags,
  normalizeAndExtractLanguageTagsIfPresent,
} from "~/needs-refactoring/lib/util/TagKeyUtils";
import { t } from "@transifex/native";
import {
  Callout,
  Dialog,
  Flex,
  Text,
  TextArea,
  VisuallyHidden,
} from "@radix-ui/themes";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import { Info } from "lucide-react";
import SearchableSelect from "~/needs-refactoring/components/shared/SearchableSelect";
import { supportedLanguageTagsOptions } from "~/modules/i18n/i18n";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import useSubmit from "~/needs-refactoring/components/CombinedFeaturePanel/useSubmit";

type Props = {
  tagKey: string;
  tagValue?: string | undefined;
  feature: AnyFeature;
  addNewLanguage: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

const DescriptionEditor = ({
  tagKey,
  tagValue,
  feature,
  addNewLanguage,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => {
  const { normalizedOSMTagKey: tagKeyWithoutLangTag } =
    normalizeAndExtractLanguageTagsIfPresent(tagKey);

  const descriptionKeys = Object.keys(feature.properties ?? {}).filter((key) =>
    key.startsWith(tagKeyWithoutLangTag),
  );
  const availableLangTags = getAvailableLangTags(
    descriptionKeys,
    tagKeyWithoutLangTag.split(":").length,
  );

  const [currentTagValue, setCurrentTagValue] = useState(tagValue);
  const [newTagValue, setNewTagValue] = useState(tagValue);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [hasDataToSubmit, setHasDataToSubmit] = useState(true);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [finalTagKey, setFinalTagKey] = useState(tagKey);

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

  const descriptionFromServerInSelectedLanguage = useMemo(() => {
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
    setHasDataToSubmit(currentTagValue !== newTagValue);
  }, [currentTagValue, newTagValue]);

  useEffect(() => {
    setTextAreaValue(descriptionFromServerInSelectedLanguage);
    setCurrentTagValue(tagValue);
    setNewTagValue(tagValue);
  }, [descriptionFromServerInSelectedLanguage, tagValue]);

  const handleTextAreaChange = (newValue: string) => {
    setTextAreaValue(newValue);
    setNewTagValue(newValue);
    setHasValueChanged(newValue !== tagValue);
    textAreaRef.current?.focus();
  };

  useEffect(() => {
    if (!addNewLanguage || hasValueChanged) {
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 0);
    }
  }, [addNewLanguage, hasValueChanged]);

  const onLanguageChange = React.useCallback(
    (newPickerValue: string) => {
      const { normalizedOSMTagKey: baseTag } =
        normalizeAndExtractLanguageTagsIfPresent(tagKey);
      const updatedTagName = [baseTag, newPickerValue].join(":");

      if (updatedTagName !== finalTagKey) {
        setFinalTagKey(updatedTagName);
      }
    },
    [tagKey, finalTagKey],
  );

  const onSubmit = useSubmit(finalTagKey, newTagValue);

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Content data-testid={`dialog_${tagKey}`}>
        <Flex direction="column" gap="3">
          <FeatureNameHeader feature={feature} />
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
                      <Info size={18} />
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
              defaultValue={addNewLanguage ? undefined : tagValue}
              value={addNewLanguage ? textAreaValue : undefined}
              placeholder={t("Enter a description here")}
              onChange={(evt) => handleTextAreaChange(evt.target.value)}
              size="2"
              radius="small"
              variant="classic"
            />
          </div>

          <Dialog.Close>
            <Flex gap="3" mt="4" justify="end">
              <SecondaryButton>{t("Cancel")}</SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  if (hasDataToSubmit) {
                    onSubmit();
                  }
                }}
              >
                {hasDataToSubmit ? t("Send") : t("Confirm")}
              </PrimaryButton>
            </Flex>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default DescriptionEditor;
