import { Badge, Button, Dialog, Flex, Text, TextArea } from "@radix-ui/themes";
import { featureEach } from "@turf/turf";
import React, { useContext, useEffect, useState } from "react";
import Picker from "~/components/CombinedFeaturePanel/editors/Picker";
import { removeLanguageTagsIfPresent } from "~/components/CombinedFeaturePanel/utils/TagKeyUtils";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
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

  const currentTagValue = feature.properties?.[tagKey] || "";
  const descriptions = Object.keys(feature.properties).filter((key) =>
    key.startsWith(tagKeyWithoutLangTag),
  );
  const availableLangTags = new Set(
    descriptions
      .filter((description) => description.split(":").length > 2)
      .map((description) => description.split(":")[2]),
  );

  console.log("available langtags: ", availableLangTags);

  const [editedTagValue, setEditedTagValue] = useState(currentTagValue);
  const [textAreaValue, setTextAreaValue] = useState(currentTagValue);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] = useState(true);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  useEffect(() => {
    setSaveButtonDoesNothing(currentTagValue === editedTagValue);
  }, [currentTagValue, editedTagValue]);

  useEffect(() => {
    if (availableLangTags.has(selectedLanguage)) {
      const newTagKey = `${tagKeyWithoutLangTag}:${selectedLanguage}`;
      const newValue = feature.properties[newTagKey] || "";
      setTextAreaValue(newValue);
    } else {
      setTextAreaValue("");
    }
  }, [
    selectedLanguage,
    availableLangTags,
    feature.properties,
    tagKeyWithoutLangTag,
  ]);

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
            Please describe how accessible this place is for wheelchair users.
            Start by selecting the language for your description.
            <Flex gap="2">
              <Badge color="orange">Note</Badge>
              <Text size="1" color="gray">
                Currently, we support a limited number of languages. More will
                be added soon! If your language is missing, please contact our
                support team. &#x1F60A;
              </Text>
            </Flex>
          </Flex>
        </Dialog.Description>

        <Flex direction="column" gap="5" style={{ width: "100%" }}>
          {/* Conditionally display Language Picker Row */}
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
            aria-label="Enter text here"
            defaultValue={currentTagValue}
            value={addingNewLanguage ? textAreaValue : undefined}
            placeholder="Enter text here"
            disabled={addingNewLanguage ? !hasValueChanged : false}
            onChange={(evt) => {
              setEditedTagValue(evt.target.value);
              onChange(evt.target.value);
            }}
            size="2"
            radius="small"
            variant="classic"
          />

          <Flex gap="3" mt="4" justify="end">
            <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
              <Button variant="soft" size="2">
                {saveButtonDoesNothing ? "Cancel" : "Back"}
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
