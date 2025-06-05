import type React from "react";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { EditButton } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditButton";
import { EditDropdownMenu } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropDownMenu";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import { AddDescriptionButton } from "~/modules/feature-panel/components/AddDescriptionButton";

import { t } from "@transifex/native";

type Props = {
  tags: TagOrTagGroup;
};

const WheelchairSection = ({ tags }: Props) => {
  const wheelchairInfo = tags.children.find((tag) => tag.key === "wheelchair");

  const wheelchairDescription = tags.children.find((tag) =>
    tag.key.startsWith("wheelchair:description"),
  );

  return (
    <>
      {wheelchairInfo && (
        <Grid columns="6rem 1fr" mb="3">
          <Box>
            <Text size="3" color="gray">
              {useTranslations(wheelchairInfo.tagProps?.keyLabel)}
            </Text>
          </Box>
          <Flex direction="row" gap="7" justify="between">
            <Text size="3">
              <StyledMarkdown inline>
                {useTranslations(
                  wheelchairInfo.tagProps?.valueAttribute?.label,
                )}
              </StyledMarkdown>
            </Text>
            <EditButton addNewLanguage={false} tagKey={wheelchairInfo.key} />
          </Flex>
        </Grid>
      )}

      {wheelchairDescription ? (
        <Grid columns="auto min-content" mb="3" gap="var(--space-3)">
          <Box>
            <Text size="3">{wheelchairDescription.value}</Text>
          </Box>
          <Box>
            <EditDropdownMenu tagKey={wheelchairDescription.key} />
          </Box>
        </Grid>
      ) : (
        <Flex direction="row">
          <AddDescriptionButton tagKey="wheelchair:description">
            {t("Add a description")}
          </AddDescriptionButton>
        </Flex>
      )}
    </>
  );
};
export default WheelchairSection;
