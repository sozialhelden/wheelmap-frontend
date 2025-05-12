import React from "react";
import { Card, Flex, Strong, Text } from "@radix-ui/themes";
import { EditButton } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditButton";
import { EditDropdownMenu } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropDownMenu";
import styled from "styled-components";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import TagGroup from "~/modules/feature-panel/components/TagGroup";

type Props = {
  tags: TagOrTagGroup;
};

const StyledSection = styled.div`
    padding: var(--space-3);
    display: flex; flex-direction: column; gap: var(--space-3);
`;

const ToiletsSection = ({ tags }: Props) => {
  const toiletInfo = tags.children.find(
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
    <Card variant="surface" size="1" mt="30px">
      <StyledSection>
        {toiletInfo && (
          <Flex direction="row" gap="7" justify="between">
            <Text size="3">
              <Strong>{toiletInfo.tagProps?.keyLabel}</Strong>
            </Text>
            <Text size="3">
              {useTranslations(toiletInfo.tagProps?.valueAttribute.label)}
            </Text>
            <EditButton addNewLanguage={false} tagKey={toiletInfo.key} />
          </Flex>
        )}
        <Flex direction="row" justify="between">
          {toiletsDescription ? (
            <>
              <Text>{toiletsDescription.value}</Text>
              <EditDropdownMenu tagKey={toiletsDescription.key} />
            </>
          ) : (
            <SecondaryButton size="2">
              <Pencil1Icon width="18" height="18" />
              {/*TODO: make button clickable */}
              Add a description for this toilet
            </SecondaryButton>
          )}
        </Flex>
        {otherChildren && <TagGroup tags={otherChildren} />}
      </StyledSection>
    </Card>
  );
};
export default ToiletsSection;
