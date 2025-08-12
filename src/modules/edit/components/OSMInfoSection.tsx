import { Box, Grid, Text } from "@radix-ui/themes";
import React from "react";
import TagGroupRenderer from "~/modules/edit/components/TagGroupRenderer";
import type { TagOrTagGroup } from "~/modules/edit/hooks/useOsmTags";

interface Props {
  tags: TagOrTagGroup[];
}

const OsmInfoSection = ({ tags }: Props) => {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tags?.map((tagOrTagGroup) => (
        <li key={tagOrTagGroup.key} style={{ marginBottom: "var(--space-3)" }}>
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
        </li>
      ))}
    </ul>
  );
};

export default OsmInfoSection;
