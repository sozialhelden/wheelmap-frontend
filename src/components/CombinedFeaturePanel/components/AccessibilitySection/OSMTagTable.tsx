import { useContext } from 'react'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'
import { TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { OSMTagTableRowOrListElement } from './OSMTagTableRowOrListElement'
import { StyledList } from './StyledList'
import { StyledTable } from './StyledTable'
import { tagsWithSemicolonSupport } from '../../../../lib/model/osm/tag-config/tagsWithSemicolonSupport'
import { getOSMTagProps } from '../../../../lib/model/osm/tag-config/getOSMTagProps'
import { valueRenderFunctions } from './valueRenderFunctions'
import useAccessibilityAttributesIdMap from '../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'
import { FeaturePanelContext } from '../../FeaturePanelContext'

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
}

function getTagValues(feature: TypeTaggedOSMFeature, key: string) {
  const originalOSMTagValue = feature.properties[key] ?? ''
  let tagValues: (string | number)[] = []
  if (tagsWithSemicolonSupport.includes(key) && typeof originalOSMTagValue === 'string') {
    tagValues = originalOSMTagValue?.split(';') || []
  } else {
    tagValues = [originalOSMTagValue]
  }
  return tagValues
}

export default function OSMTagTable({ feature, isHorizontal, nestedTags }: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
  isHorizontal?: boolean;
}) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const languageTags = useCurrentLanguageTagStrings()
  const {
    map: attributesById,
  } = useAccessibilityAttributesIdMap(languageTags)

  const listItems = nestedTags.map(({ key, children }) => {
    const tagValues = getTagValues(feature, key)

    return tagValues.map((singleValue) => {
      const matchedKey = Object.keys(valueRenderFunctions)
        .find((renderFunctionKey) => key.match(renderFunctionKey))
      const tagProps = getOSMTagProps({
        key,
        matchedKey,
        singleValue,
        languageTags,
        attributesById,
        feature,
        baseFeatureUrl,
      })

      const tagId = tagProps.valueAttribute?._id
      if (!children || !children.length) {
        return <OSMTagTableRowOrListElement {...tagProps} key={tagId} isHorizontal={isHorizontal} />
      }

      const nestedTable = (
        <OSMTagTable
          key={tagId}
          feature={feature}
          nestedTags={children}
          isHorizontal={tagProps.isHorizontal}
        />
      )
      return (
        <OSMTagTableRowOrListElement
          key={tagId}
          {...tagProps}
          valueElement={nestedTable}
          isHorizontal={isHorizontal}
        />
      )
    })
  })

  if (isHorizontal) {
    return <StyledList>{listItems}</StyledList>
  }
  return <StyledTable>{listItems}</StyledTable>
}
