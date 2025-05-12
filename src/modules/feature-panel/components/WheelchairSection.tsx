import React from "react";
import { Card, Flex, Strong, Text } from "@radix-ui/themes";
import { EditButton } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditButton";
import { EditDropdownMenu } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/EditDropDownMenu";
import styled from "styled-components";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

type Props = {
  tags: TagOrTagGroup;
};

const StyledSection = styled.div`
    padding: var(--space-3);
    display: flex; flex-direction: column; gap: var(--space-3);
`;

const WheelchairSection = ({ tags }: Props) => {
  const wheelchair_info = tags.children.find((tag) => tag.key === "wheelchair");

  const wheelchair_description = tags.children.find((tag) =>
    tag.key.startsWith("wheelchair:description"),
  );

  return (
    <Card variant="surface" size="1" mt="30px">
      <StyledSection>
        {wheelchair_info && (
          <Flex direction="row" gap="7" justify="between">
            <Text size="3">
              <Strong>{wheelchair_info.tagProps?.keyLabel}</Strong>
            </Text>
            <Text size="3">
              {" "}
              {useTranslations(wheelchair_info.tagProps?.valueAttribute.label)}
            </Text>
            <EditButton addNewLanguage={false} tagKey={wheelchair_info.key} />
          </Flex>
        )}

        {wheelchair_description ? (
          <Flex direction="row" justify="between">
            <Text>{wheelchair_description.value}</Text>
            <EditDropdownMenu tagKey={wheelchair_description.key} />
          </Flex>
        ) : (
          <Flex direction="row" gap="8">
            <SecondaryButton size="2">
              <Pencil1Icon width="18" height="18" />
              {/*TODO: make button clickable */}
              Add a wheelchair description for this place
            </SecondaryButton>
          </Flex>
        )}
      </StyledSection>
    </Card>
  );
};
export default WheelchairSection;
