import React from "react";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { EditDropdownMenu } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropDownMenu";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { AddDescriptionButton } from "~/modules/feature-panel/components/AddDescriptionButton";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import { EditButton } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditButton";
import TagRenderer from "~/modules/feature-panel/components/TagRenderer";
import { t } from "@transifex/native";

type Props = {
  tags: TagOrTagGroup;
};

const ToiletsSection = ({ tags }: Props) => {
  const toiletWheelchairInfo = tags.children.find(
    (tag) => tag.key === "toilets:wheelchair",
  );

  const toiletsDescription = tags.children.find((tag) =>
    tag.key.startsWith("toilets:wheelchair:description"),
  );

  const otherChildren = tags.children.filter(
    (tag) =>
      tag.key !== "toilets:wheelchair" &&
      tag.key !== "toilets:wheelchair:description",
  );

  console.log("otherChildren", otherChildren);

  return (
    <>
      {toiletWheelchairInfo && (
        <Grid columns="25% 65% 10%" mb="3">
          <Box>
            <Text size="3" color="gray">
              {toiletWheelchairInfo.tagProps?.keyLabel}
            </Text>
          </Box>

          <Box>
            <Text size="3">
              <StyledMarkdown inline>
                {useTranslations(
                  toiletWheelchairInfo.tagProps?.valueAttribute?.label,
                )}
              </StyledMarkdown>
            </Text>
          </Box>
          <Box>
            <EditButton
              addNewLanguage={false}
              tagKey={toiletWheelchairInfo.key}
            />
          </Box>
        </Grid>
      )}
      {otherChildren?.map((child) => (
        <TagRenderer
          tagOrTagGroup={child}
          key={child.key}
          color="gray"
          mt="2.75rem"
        />
      ))}

      <Flex direction="row" justify="between">
        {toiletsDescription ? (
          <>
            <Grid columns="95% 5%" mb="3">
              <Box>
                <Text>{toiletsDescription.value}</Text>
              </Box>
              <Box>
                <EditDropdownMenu tagKey={toiletsDescription.key} />
              </Box>
            </Grid>
            {/*<Text>{toiletsDescription.value}</Text>*/}
            {/*<EditDropdownMenu tagKey={toiletsDescription.key} />*/}
          </>
        ) : (
          <AddDescriptionButton tagKey="toilets:wheelchair:description">
            {t("Add a description")}
          </AddDescriptionButton>
        )}
      </Flex>
    </>
  );
};
export default ToiletsSection;
