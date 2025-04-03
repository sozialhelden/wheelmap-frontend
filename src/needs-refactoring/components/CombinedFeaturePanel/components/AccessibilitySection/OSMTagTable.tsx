import { useContext } from "react";
import useAccessibilityAttributesIdMap from "~/needs-refactoring/lib/fetchers/ac/useAccessibilityAttributesIdMap";
import type { TypeTaggedOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { getOSMTagProps } from "~/needs-refactoring/lib/model/osm/tag-config/getOSMTagProps";
import { tagsWithSemicolonSupport } from "~/needs-refactoring/lib/model/osm/tag-config/tagsWithSemicolonSupport";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import { OSMTagTableRowOrListElement } from "./OSMTagTableRowOrListElement";
import { StyledList } from "./StyledList";
import { StyledTable } from "./StyledTable";
import { valueRenderFunctions } from "./valueRenderFunctions";

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
};

function getTagValues(feature: TypeTaggedOSMFeature, key: string) {
  // addWheelchairDescription is a pseudo tag that is added to the tag list as a kind of placeholder
  // so that a call to action and an edit button can be displayed in case no wheelchair description
  // is present in the feature. In this case a pseudo tag value is returned from this function
  if (key === "addWheelchairDescription") {
    return ["addWheelchairDescription"];
  }
  const originalOSMTagValue = feature.properties[key] ?? "";
  let tagValues: (string | number)[] = [];
  if (
    tagsWithSemicolonSupport.includes(key) &&
    typeof originalOSMTagValue === "string"
  ) {
    tagValues = originalOSMTagValue?.split(";") || [];
  } else {
    tagValues = [originalOSMTagValue];
  }
  return tagValues;
}

export default function OSMTagTable({
  feature,
  isHorizontal,
  nestedTags,
}: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
  isHorizontal?: boolean;
}) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  const { map: attributesById } = useAccessibilityAttributesIdMap();

  const listItems = nestedTags.map(({ key, children }) => {
    const tagValues = getTagValues(feature, key);

    return tagValues.map((singleValue) => {
      const matchedKey = Object.keys(valueRenderFunctions).find(
        (renderFunctionKey) => key.match(renderFunctionKey),
      );
      const tagProps = getOSMTagProps({
        key,
        matchedKey,
        singleValue,
        attributesById,
        feature,
        baseFeatureUrl,
      });

      const tagId = tagProps.valueAttribute?._id;
      if (!children || !children.length) {
        return (
          <OSMTagTableRowOrListElement
            {...tagProps}
            key={tagId}
            isHorizontal={isHorizontal}
          />
        );
      }

      const nestedTable = (
        <OSMTagTable
          key={tagId}
          feature={feature}
          nestedTags={children}
          isHorizontal={tagProps.isHorizontal}
        />
      );
      return (
        <OSMTagTableRowOrListElement
          key={tagId}
          {...tagProps}
          valueElement={nestedTable}
          isHorizontal={isHorizontal}
        />
      );
    });
  });

  if (isHorizontal) {
    return <StyledList>{listItems}</StyledList>;
  }
  return <StyledTable>{listItems}</StyledTable>;
}
