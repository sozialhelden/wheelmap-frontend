import { Badge, Flex } from "@radix-ui/themes";
import React from "react";
import type { TagOrTagGroup } from "~/modules/feature-panel/hooks/useOsmTags";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

interface Props {
  tags: TagOrTagGroup[];
}

const TagGroup = ({ tags }: Props) => {
  console.log("tags", tags);
  return (
    <Flex direction="row" gap="0.4rem">
      {tags?.map((child) => (
        <Badge size="3" radius="full" color="gray" highContrast key={child.key}>
          {useTranslations(child.tagProps?.valueAttribute?.shortLabel)}{" "}
        </Badge>
      ))}
    </Flex>
  );
};
export default TagGroup;
