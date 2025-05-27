import React from "react";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { EditDropdownMenu } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropDownMenu";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { AddDescriptionButton } from "~/modules/feature-panel/components/AddDescriptionButton";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import { EditButton } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditButton";
import { t } from "@transifex/native";
import NextToiletDirections from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/NextToiletDirections";
import type { NextToilet } from "~/modules/feature-panel/hooks/useNextToilet";
import StyledTag from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/StyledTag";
import { getValueLabel } from "~/modules/feature-panel/utils/getValueLabel";

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
      <Flex
        direction="row"
        gap="0.4rem"
        wrap="wrap"
        style={{ rowGap: ".75rem" }}
      >
        {otherTags?.map((child) =>
          typeof child.tagProps?.valueElement === "object" &&
          child.tagProps?.valueElement !== null ? (
            <StyledTag size="4" radius="full" highContrast key={child.key}>
              {React.cloneElement(child.tagProps.valueElement)}
            </StyledTag>
          ) : (
            // otherwise render the plain value label inside a tag
            <StyledTag size="4" radius="full" highContrast key={child.key}>
              <StyledMarkdown inline>{getValueLabel(child)}</StyledMarkdown>
            </StyledTag>
          ),
        )}
      </Flex>

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
          <Flex direction="row" justify="between" mb="3">
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
