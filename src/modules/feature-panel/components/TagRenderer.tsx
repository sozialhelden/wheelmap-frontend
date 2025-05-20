import React from "react";
import { type Badge, Flex } from "@radix-ui/themes";
import StyledTag from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/StyledTag";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import { getValueLabel } from "~/modules/feature-panel/utils/getValueLabel";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";

interface Props extends React.ComponentProps<typeof Badge> {
  tagOrTagGroup: TagOrTagGroup;
}

const TagRenderer = ({ tagOrTagGroup }: Props) => {
  const hasChildren = Object.prototype.hasOwnProperty.call(
    tagOrTagGroup,
    "children",
  );
  return (
    <Flex direction="row" gap="0.4rem" wrap="wrap" style={{ rowGap: ".75rem" }}>
      {hasChildren ? (
        tagOrTagGroup.children.map((child) => (
          <TagRenderer key={child.key} tagOrTagGroup={child} />
        ))
      ) : (
        <>
          {/* if there is a suitable value render function, render it*/}
          {typeof tagOrTagGroup.tagProps?.valueElement === "object" &&
          tagOrTagGroup.tagProps?.valueElement !== null ? (
            <StyledTag size="4" radius="full" highContrast>
              {React.cloneElement(tagOrTagGroup.tagProps.valueElement)}
            </StyledTag>
          ) : (
            // otherwise render the plain value label inside a tag
            <StyledTag size="4" radius="full" highContrast>
              <StyledMarkdown inline>
                {getValueLabel(tagOrTagGroup)}
              </StyledMarkdown>
            </StyledTag>
          )}
        </>
      )}
    </Flex>
  );
};

export default TagRenderer;
