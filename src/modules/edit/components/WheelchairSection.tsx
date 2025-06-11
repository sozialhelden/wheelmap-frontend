import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import type React from "react";
import { AddDescriptionButton } from "~/modules/edit/components/AddDescriptionButton";
import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";

import { t } from "@transifex/native";
import WheelchairEditorNew from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/WheelchairEditorNew";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import EditDropdownMenu from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropdownMenu";

type Props = {
  tags: TagOrTagGroup;
  feature: AnyFeature;
};

const WheelchairSection = ({ tags, feature }: Props) => {
  const wheelchairInfo = tags.children.find((tag) => tag.key === "wheelchair");

  const wheelchairDescription = tags.children.find((tag) =>
    tag.key.startsWith("wheelchair:description"),
  );

  const wheelchairInfoLabel = useTranslations(
    String(wheelchairInfo?.tagProps?.keyLabel),
  );
  const wheelchairInfoText = useTranslations(
    wheelchairInfo?.tagProps?.valueAttribute?.label,
  );

  return (
    <>
      {wheelchairInfo && (
        <Grid columns="6rem 1fr" mb="3">
          <Box>
            <Text size="3" color="gray">
              {wheelchairInfoLabel}
            </Text>
          </Box>
          <Flex direction="row" gap="7" justify="between">
            <Text size="3">
              <StyledMarkdown inline>
                {String(wheelchairInfoText)}
              </StyledMarkdown>
            </Text>
            <WheelchairEditorNew
              tagKey={wheelchairInfo.key}
              tagValue={String(wheelchairInfo.value)}
              feature={feature}
            />
          </Flex>
        </Grid>
      )}

      {wheelchairDescription ? (
        <Grid columns="auto min-content" mb="3" gap="var(--space-3)">
          <Box>
            <Text size="3">
              {wheelchairDescription.value ||
                wheelchairDescription.tagProps?.valueElement}
            </Text>
          </Box>
          <Box>
            <EditDropdownMenu
              tagKey={wheelchairDescription.key}
              tagValue={wheelchairDescription.value}
              feature={feature}
            />
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
