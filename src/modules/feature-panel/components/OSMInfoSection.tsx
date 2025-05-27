import React from "react";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import TagGroupRenderer from "~/modules/feature-panel/components/TagGroupRenderer";
import { Box, Grid, Text } from "@radix-ui/themes";

interface Props {
  tags: TagOrTagGroup[];
}

const OsmInfoSection = ({ tags }: Props) => {
  return (
    <div>
      {tags?.map((tagOrTagGroup) => (
        <Grid key={tagOrTagGroup.key} columns="6rem auto" gap="3" mb="3">
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
      ))}
    </div>
  );
};
export default OsmInfoSection;
