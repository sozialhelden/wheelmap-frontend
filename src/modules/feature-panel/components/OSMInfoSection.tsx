import { Box, Grid, Text } from "@radix-ui/themes";
import React from "react";
import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";
import TagGroupRenderer from "~/modules/feature-panel/components/TagGroupRenderer";
import { TagList } from "~/modules/feature-panel/components/TagList";
import { TagListItem } from "~/modules/feature-panel/components/TagListItem";

interface Props {
  tags: TagOrTagGroup[];
}

const OsmInfoSection = ({ tags }: Props) => {
  return (
    <TagList style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tags?.map((tagOrTagGroup) => (
        <TagListItem
          key={tagOrTagGroup.key}
          style={{ marginBottom: "var(--space-3)" }}
        >
          <Grid columns="6rem auto" gap="3">
            <Box>
              <Text size="3" color="gray">
                {tagOrTagGroup.tagProps?.keyLabel}
              </Text>
            </Box>
            <Box>
              <TagGroupRenderer
                key={tagOrTagGroup.key}
                tagOrTagGroup={tagOrTagGroup}
              />
            </Box>
          </Grid>
        </TagListItem>
      ))}
    </TagList>
  );
};

export default OsmInfoSection;
