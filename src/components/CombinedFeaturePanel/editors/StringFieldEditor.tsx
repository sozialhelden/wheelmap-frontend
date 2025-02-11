import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Dialog,
  Flex,
  Text,
  TextArea,
  VisuallyHidden,
} from "@radix-ui/themes";
import type React from "react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { t } from "ttag";
import {
  getAvailableLangTags,
  normalizeAndExtractLanguageTagsIfPresent,
} from "~/components/CombinedFeaturePanel/utils/TagKeyUtils";
import SearchableSelect from "~/components/shared/SearchableSelect";
import { languageTagMapForStringFieldEditor } from "~/lib/i18n/languageTagsForStringFieldEditor";
import { FeaturePanelContext } from "../FeaturePanelContext";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";

export const StringFieldEditor: React.FC<BaseEditorProps> = ({
  feature,
  tagKey,
  addingNewLanguage,
  onChange,
  onSubmit,
  onLanguageChange,
  onClose,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  if (!tagKey) {
    throw new Error("Editing a tag value works only with a defined tag key.");
  }
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

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

  const dialogDescription = addingNewLanguage
    ? t`Please describe how accessible this place is for wheelchair users. Start by selecting the language for your description.`
    : t`Please edit this description in the same language.`;

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
    if (!addingNewLanguage || hasValueChanged) {
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 0);
    }
  }, [addingNewLanguage, hasValueChanged]);

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Content>
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
              {addingNewLanguage && (
                <Flex gap="2">
                  <Callout.Root>
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text as="div">
                      {t`Currently, we support a limited number of languages.`}
                      <br />
                      {t`More will be added soon! If your language is missing, please contact our support team.`}
                    </Callout.Text>
                  </Callout.Root>
                </Flex>
              )}
            </Flex>
          </Dialog.Description>
        </Flex>

        <Flex direction="column" gap="3" style={{ width: "100%" }}>
          {addingNewLanguage && (
            <Flex align="center" gap="3" style={{ width: "100%" }}>
              <Text as="label" size="2">
                Select a language:
              </Text>
              <Flex style={{ flexGrow: 1 }}>
                <SearchableSelect
                  selectPlaceholder={t`Languages`}
                  items={languageTagMapForStringFieldEditor}
                  onSelect={(value) => {
                    setSelectedLanguage(value);
                    if (onLanguageChange) {
                      onLanguageChange(value);
                      if (!hasValueChanged) {
                        setHasValueChanged(true);
                      }
                    }
                  }}
                  ariaLabelForTrigger={t`Select a language`}
                  ariaLabelForContent={t`List of languages`}
                />
              </Flex>
            </Flex>
          )}

          <div hidden={addingNewLanguage ? !hasValueChanged : false}>
            <TextArea
              ref={textAreaRef}
              aria-label={t`Enter a description here`}
              defaultValue={addingNewLanguage ? undefined : initialTagValue}
              value={addingNewLanguage ? textAreaValue : undefined}
              placeholder={t`Enter a description here`}
              onChange={(evt) => handleTextAreaChange(evt.target.value)}
              size="2"
              radius="small"
              variant="classic"
            />
          </div>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" size="2" onClick={onClose}>
              {t`Cancel`}
            </Button>

            <Button
              variant="solid"
              size="2"
              onClick={saveButtonDoesNothing ? onClose : onSubmit}
            >
              {saveButtonDoesNothing ? t`Confirm` : t`Send`}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
