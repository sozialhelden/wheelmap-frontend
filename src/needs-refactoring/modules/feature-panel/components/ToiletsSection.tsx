import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import React from "react";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import EditDropdownMenu from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropdownMenu";
import NextToiletDirections from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/NextToiletDirections";
import StyledTag from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/StyledTag";
import ToiletsWheelchairEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/ToiletsWheelchairEditor";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import type { NextAccessibleToilet } from "~/needs-refactoring/modules/edit/hooks/useNextAccessibleToilet";
import type { TagOrTagGroup } from "~/needs-refactoring/modules/edit/hooks/useOsmTags";
import {
  getValueLabel,
  maskEmojisForScreenReaders,
} from "~/needs-refactoring/modules/edit/utils/getValueLabel";
import { AddDescriptionButton } from "~/needs-refactoring/modules/feature-panel/components/AddDescriptionButton";
import { TagList } from "~/needs-refactoring/modules/feature-panel/components/TagList";
import { TagListItem } from "~/needs-refactoring/modules/feature-panel/components/TagListItem";

type Props = {
  nextToilet?: NextAccessibleToilet;
  isLoading?: boolean;
  tags?: TagOrTagGroup;
  feature: AnyFeature;
};

const ToiletsSection = ({ nextToilet, isLoading, tags, feature }: Props) => {
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
      <Grid columns="6rem 1fr" mb="3" data-testid="toilet-section">
        <Box>
          <Text size="3" color="gray" aria-hidden>
            {t("WC")}
          </Text>
        </Box>

        {wheelchairInfo ? (
          <Flex direction="row" gap="7" justify="between">
            <Text size="3">
              <StyledMarkdown inline>
                {maskEmojisForScreenReaders(
                  useTranslations(
                    wheelchairInfo?.tagProps?.valueAttribute?.label ?? "",
                  ) || "",
                )}
              </StyledMarkdown>
            </Text>
            <ToiletsWheelchairEditor
              feature={feature}
              tagKey={wheelchairInfo.key}
              tagValue={String(wheelchairInfo.value)}
            />
          </Flex>
        ) : (
          <ToiletsWheelchairEditor
            feature={feature}
            tagKey="toilets:wheelchair"
            isNewlyTagged={true}
          />
        )}
      </Grid>
      <Box>
        <VisuallyHidden>
          <Heading as="h3">{t("Toilet features")}</Heading>
          {!otherTags ||
            (otherTags.length === 0 && (
              <Text>
                {t(
                  "There is currently no additional information for this toilet.",
                )}
              </Text>
            ))}
        </VisuallyHidden>
        <Flex direction="row" wrap="wrap" gapX="1" gapY="2" asChild>
          <TagList>
            {otherTags?.map((child) => (
              <TagListItem key={child.key}>
                {typeof child.tagProps?.valueElement === "object" &&
                child.tagProps?.valueElement !== null ? (
                  // if there is a render function render it
                  <StyledTag>
                    {React.cloneElement(child.tagProps.valueElement)}
                  </StyledTag>
                ) : (
                  // otherwise render the plain value label inside a tag
                  <StyledTag>
                    <StyledMarkdown inline>
                      {getValueLabel(child)}
                    </StyledMarkdown>
                  </StyledTag>
                )}
              </TagListItem>
            ))}
          </TagList>
        </Flex>
      </Box>

      {wheelchairInfo &&
        (description ? (
          <Grid columns="auto min-content" mb="3" gap="var(--space-2)">
            <Box>
              <Text>
                {description.value || description.tagProps?.valueElement}
              </Text>
            </Box>
            <Box>
              <EditDropdownMenu
                tagKey={description.key}
                tagValue={description.value}
                feature={feature}
              />
            </Box>
          </Grid>
        ) : (
          <Flex direction="row" justify="between" mb="3">
            <AddDescriptionButton tagKey="toilets:wheelchair:description">
              {t("Add a description for this toilet")}
            </AddDescriptionButton>
          </Flex>
        ))}

      {(wheelchairInfo?.value === "no" || !wheelchairInfo) && nextToilet && (
        <NextToiletDirections nextToilet={nextToilet} isLoading={isLoading} />
      )}
    </>
  );
};
export default ToiletsSection;
