import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import EditDescriptionDropdownMenu from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDescriptionDropdownMenu";
import WheelchairEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/WheelchairEditor";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import type { TagOrTagGroup } from "~/needs-refactoring/modules/edit/hooks/useOsmTags";
import { maskEmojisForScreenReaders } from "~/needs-refactoring/modules/edit/utils/getValueLabel";
import { AddDescriptionButton } from "~/needs-refactoring/modules/feature-panel/components/AddDescriptionButton";

type Props = {
  tags?: TagOrTagGroup;
  feature: AnyFeature;
};

const WheelchairSection = ({ tags, feature }: Props) => {
  const wheelchairInfo = tags?.children.find((tag) => tag.key === "wheelchair");

  const wheelchairDescription = tags?.children.find((tag) =>
    tag.key.startsWith("wheelchair:description"),
  );

  const wheelchairInfoLabel = useTranslations(
    String(wheelchairInfo?.tagProps?.keyLabel),
  );
  const wheelchairInfoText = maskEmojisForScreenReaders(
    useTranslations(wheelchairInfo?.tagProps?.valueAttribute?.label ?? "") ||
      "",
  );

  return (
    <>
      {wheelchairInfo ? (
        <>
          <Grid columns="6rem 1fr" mb="3" data-testid="wheelchair-section">
            <Box>
              <Text size="3" color="gray" aria-hidden>
                {wheelchairInfoLabel}
              </Text>
            </Box>
            <Flex direction="row" gap="7" justify="between">
              <Text size="3">
                <StyledMarkdown inline>
                  {String(wheelchairInfoText)}
                </StyledMarkdown>
              </Text>
              <WheelchairEditor
                tagKey={wheelchairInfo.key}
                tagValue={String(wheelchairInfo.value)}
                feature={feature}
              />
            </Flex>
          </Grid>

          {wheelchairDescription ? (
            <Grid columns="auto min-content" mb="3" gap="var(--space-3)">
              <Box>
                <Text size="3">
                  {wheelchairDescription.value ||
                    wheelchairDescription.tagProps?.valueElement}
                </Text>
              </Box>
              <Box>
                <EditDescriptionDropdownMenu
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
      ) : (
        <WheelchairEditor
          tagKey="wheelchair"
          feature={feature}
          isNewlyTagged={true}
        />
      )}
    </>
  );
};
export default WheelchairSection;
