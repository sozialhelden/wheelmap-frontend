import { Badge, Button, Dialog, Flex, Text, TextArea } from "@radix-ui/themes";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Picker from "~/components/CombinedFeaturePanel/editors/Picker";
import { removeLanguageTagsIfPresent } from "~/components/CombinedFeaturePanel/utils/TagKeyUtils";
import { languageTagMapForStringFieldEditor } from "~/lib/i18n/languageTagsForStringFieldEditor";
import { AppStateLink } from "../../App/AppStateLink";
import { FeaturePanelContext } from "../FeaturePanelContext";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";

export const StringFieldEditor = ({
  feature,
  tagKey,
  addingNewLanguage,
  onChange,
  handleSubmitButtonClick,
  passLanguagePickerValueToParent,
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  /* Code to autofill the language picker with the browser language
   * This is disabled now, because the text area needs to be disabled unless a language is selected
   * In case the pre selected language is the intended language of the user, which might actually often be the
   * case, the text area would stay disabled, which is confusing for the user
   * */

  //const currentLangTag = useCurrentLanguageTagStrings()[0];
  /*const defaultLanguageInPicker = languageTagMapForStringFieldEditor.find(
    (entry) => entry.value === currentLangTag,
  );*/

  const tagKeyWithoutLangTag = removeLanguageTagsIfPresent(tagKey);
  console.log("tag key without lang tag: ", tagKeyWithoutLangTag);

  const initialTagValue = feature.properties?.[tagKey] || "";
  const descriptionKeys = Object.keys(feature.properties).filter((key) =>
    key.startsWith(tagKeyWithoutLangTag),
  );
  //TODO: reimplement this in a robust manner as a reusable function in TagKeyUtils.tsx
  const availableLangTags = new Set(
    descriptionKeys
      .filter((description) => description.split(":").length > 2)
      .map((description) => description.split(":").at(-1) || ""),
  );

  console.log("available langtags: ", availableLangTags);

  const [currentTagValue, setCurrentTagValue] = useState(initialTagValue);
  const [editedTagValue, setEditedTagValue] = useState(initialTagValue);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] = useState(true);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const dialogDescription = addingNewLanguage
    ? "Please describe how accessible this place is for wheelchair users. Start by selecting the language for your description."
    : "Please describe how accessible this place is for wheelchair users.";

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const initialValue = useMemo(() => {
    if (availableLangTags.has(selectedLanguage)) {
      const newTagKey = `${tagKeyWithoutLangTag}:${selectedLanguage}`;
      return feature.properties[newTagKey] || "";
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
  }, [initialValue]);

  const handleTextAreaChange = (newValue) => {
    setTextAreaValue(newValue);
    setEditedTagValue(newValue);
    setHasValueChanged(newValue !== initialTagValue);
    onChange(newValue);
    textAreaRef.current?.focus();
  };

  // TODO: find a better way to keep the focus on the text area, this approach causes flickering
  useEffect(() => {
    if (!addingNewLanguage || hasValueChanged) {
      // When the textarea is enabled, ensure it regains focus
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 0);
    }
  }, [addingNewLanguage, hasValueChanged]);

  return (
    <Dialog.Root open>
      <Dialog.Content>
        <FeatureNameHeader feature={feature}>
          {feature["@type"] === "osm:Feature" && (
            <FeatureImage feature={feature} />
          )}
        </FeatureNameHeader>

        <Dialog.Title>{`Editing ${tagKey}`}</Dialog.Title>

        <Dialog.Description size="2" mb="4">
          <Flex direction="column" gap="3">
            {dialogDescription}
            {addingNewLanguage && (
              <Flex gap="2">
                <Badge color="orange">Note</Badge>
                <Text size="1" color="gray">
                  Currently, we support a limited number of languages. More will
                  be added soon! If your language is missing, please contact our
                  support team. &#x1F60A;
                </Text>
              </Flex>
            )}
          </Flex>
        </Dialog.Description>

        <Flex direction="column" gap="5" style={{ width: "100%" }}>
          {addingNewLanguage && (
            <Flex align="center" gap="3" style={{ width: "100%" }}>
              <Text as="label" size="2" id="language-picker-label">
                Select a language:
              </Text>
              <Flex style={{ flexGrow: 1 }}>
                <Picker
                  id="language-picker"
                  searchFieldPlaceholder="Search for languages"
                  pickerPlaceholder="Select your language"
                  items={languageTagMapForStringFieldEditor}
                  onSelect={(value) => {
                    setSelectedLanguage(value);
                    if (passLanguagePickerValueToParent) {
                      passLanguagePickerValueToParent(value);
                      if (!hasValueChanged) {
                        setHasValueChanged(true);
                      }
                    }
                  }}
                  aria-labelledby="language-picker-label"
                />
              </Flex>
            </Flex>
          )}

          <TextArea
            ref={textAreaRef}
            aria-label="Enter text here"
            defaultValue={addingNewLanguage ? undefined : initialTagValue}
            value={addingNewLanguage ? textAreaValue : undefined}
            placeholder="Enter text here"
            disabled={addingNewLanguage ? !hasValueChanged : false}
            onChange={(evt) => handleTextAreaChange(evt.target.value)}
            size="2"
            radius="small"
            variant="classic"
          />

          <Flex gap="3" mt="4" justify="end">
            <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
              <Button variant="soft" size="2">
                Cancel
              </Button>
            </AppStateLink>

            <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
              <Button
                variant="solid"
                size="2"
                onClick={
                  saveButtonDoesNothing ? undefined : handleSubmitButtonClick
                }
              >
                {saveButtonDoesNothing ? "Confirm" : "Send"}
              </Button>
            </AppStateLink>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
