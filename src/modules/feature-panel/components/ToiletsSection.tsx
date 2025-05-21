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
import NextToiletDirections from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/NextToiletDirections";
import type { NextToilet } from "~/modules/feature-panel/hooks/useNextToilet";

type Props = {
  nextToilet?: NextToilet;
  isLoading?: boolean;
  tags?: TagOrTagGroup;
};

const ToiletsSection = ({ nextToilet, isLoading, tags }: Props) => {
  const wheelchairInfo = tags?.children.find(
    (tag) => tag.key === "toilets:wheelchair",
  );

  const description = tags?.children.find((tag) =>
    tag.key.startsWith("toilets:wheelchair:description"),
  );

  const otherTags = tags?.children.filter(
    (tag) =>
      tag.key !== "toilets:wheelchair" &&
      tag.key !== "toilets:wheelchair:description",
  );

  return (
    <>
      {wheelchairInfo && (
        <Grid columns="6rem auto min-content" mb="3">
          <Box>
            <Text size="3" color="gray">
              {wheelchairInfo.tagProps?.keyLabel}
            </Text>
          </Box>

          <Box>
            <Text size="3">
              <StyledMarkdown inline>
                {useTranslations(
                  wheelchairInfo.tagProps?.valueAttribute?.label,
                )}
              </StyledMarkdown>
            </Text>
          </Box>
          <Box>
            <EditButton addNewLanguage={false} tagKey={wheelchairInfo.key} />
          </Box>
        </Grid>
      )}
      {otherTags?.map((child) => (
        <TagRenderer
          tagOrTagGroup={child}
          key={child.key}
          color="gray"
          mt="2.75rem"
        />
      ))}

      {wheelchairInfo &&
        (description ? (
          <Grid columns="auto min-content" mb="3" gap="1rem">
            <Box>
              <Text>{description.value}</Text>
            </Box>
            <Box>
              <EditDropdownMenu tagKey={description.key} />
            </Box>
          </Grid>
        ) : (
          <Flex direction="row" justify="between">
            <AddDescriptionButton tagKey="toilets:wheelchair:description">
              {t("Add a description for this toilet")}
            </AddDescriptionButton>
          </Flex>
        ))}

      {(wheelchairInfo?.value === "no" || !wheelchairInfo) && (
        <NextToiletDirections nextToilet={nextToilet} isLoading={isLoading} />
      )}
    </>
  );
};
export default ToiletsSection;
