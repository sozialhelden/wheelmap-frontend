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
import { AddDescriptionButton } from "~/modules/edit/components/AddDescriptionButton";
import type { NextAccessibleToilet } from "~/modules/edit/hooks/useNextAccessibleToilet";
import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import { getValueLabel } from "~/modules/edit/utils/getValueLabel";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import EditDropdownMenu from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropdownMenu";
import NextToiletDirections from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/NextToiletDirections";
import StyledTag from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/StyledTag";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import ToiletsWheelchairEditor from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/ToiletsWheelchairEditor";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

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
      {wheelchairInfo && (
        <Grid columns="6rem 1fr" mb="3">
          <Box>
            <Text size="3" color="gray" aria-hidden>
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
            <EditButton
              addNewLanguage={false}
              tagKey={wheelchairInfo.key}
              ariaLabel={t("Edit toilet accessibility")}
            />
            <ToiletsWheelchairEditor
              feature={feature}
              tagKey={wheelchairInfo.key}
              tagValue={String(wheelchairInfo.value)}
            />
          </Flex>
        </Grid>
      )}
      <Box>
        <VisuallyHidden>
          <Heading as="h3">{t("Toilet features")}</Heading>
          {!otherTags && (
            <Text>
              {t("There is currently no toilet information about this place.")}
            </Text>
          )}
        </VisuallyHidden>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <Flex as="div" direction="row" wrap="wrap" gapX="1" gapY="2">
            {otherTags?.map((child) => (
              <li key={child.key} style={{ display: "inline-block" }}>
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
              </li>
            ))}
          </Flex>
        </ul>
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

      {(wheelchairInfo?.value === "no" || !wheelchairInfo) && (
        <>
          <VisuallyHidden>
            <Heading as="h3">{t("Link to next accessible toilet")}</Heading>
          </VisuallyHidden>
          <NextToiletDirections nextToilet={nextToilet} isLoading={isLoading} />
        </>
      )}
    </>
  );
};
export default ToiletsSection;
