import { sortBy } from "lodash";
import { normalizeAndExtractLanguageTagsIfPresent } from "~/needs-refactoring/lib/util/TagKeyUtils";
import { sortOrderMap } from "~/needs-refactoring/lib/model/osm/tag-config/sortOrderMap";
import type { ITreeNode } from "~/modules/feature-panel/hooks/useOsmTags";

export function nestTree(tree: ITreeNode) {
  const entries = Object.entries(tree);
  const sortedEntries = sortBy(entries, ([key]) => {
    const { normalizedOSMTagKey } =
      normalizeAndExtractLanguageTagsIfPresent(key);
    const order = sortOrderMap.get(normalizedOSMTagKey);
    return order === undefined ? 100000 : order;
  });

  return sortedEntries.map(([k, v]) => {
    if (typeof v === "string") {
      return { key: v };
    }
    return { key: k, children: nestTree(v) };
  });
}
