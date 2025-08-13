import { type Badge, Flex } from "@radix-ui/themes";
import React from "react";
import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import { getValueLabel } from "~/modules/edit/utils/getValueLabel";
import StyledTag from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/StyledTag";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";

interface Props extends React.ComponentProps<typeof Badge> {
  tagOrTagGroup: TagOrTagGroup;
}

const TagGroupRenderer = ({ tagOrTagGroup }: Props) => {
  return (
    <Flex direction="row" gap="0.4rem" wrap="wrap" style={{ rowGap: ".75rem" }}>
      {(tagOrTagGroup.children ?? false) ? (
        tagOrTagGroup.children.map((child) => (
          <TagGroupRenderer key={child.key} tagOrTagGroup={child} />
        ))
      ) : (
        <>
          {/*Opening hours are rendered without a tag*/}
          {tagOrTagGroup.key === "opening_hours" &&
          typeof tagOrTagGroup.tagProps?.valueElement === "object" &&
          tagOrTagGroup.tagProps.valueElement !== null ? (
            React.cloneElement(tagOrTagGroup.tagProps.valueElement)
          ) : // if there is a suitable value render function render it
          typeof tagOrTagGroup.tagProps?.valueElement === "object" &&
            tagOrTagGroup.tagProps.valueElement !== null ? (
            <StyledTag>
              {tagOrTagGroup.tagProps.keyLabel &&
                tagOrTagGroup.tagProps.hasDisplayedKey && (
                  <header> {tagOrTagGroup.tagProps.keyLabel} </header>
                )}
              {React.cloneElement(tagOrTagGroup.tagProps.valueElement)}
            </StyledTag>
          ) : (
            // otherwise render the plain value label inside a tag
            <StyledTag>
              {tagOrTagGroup.tagProps.keyLabel &&
                tagOrTagGroup.tagProps.hasDisplayedKey && (
                  <header> {tagOrTagGroup.tagProps.keyLabel} </header>
                )}
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

export default TagGroupRenderer;
