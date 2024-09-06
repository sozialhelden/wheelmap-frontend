import { useRouter } from 'next/router'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'
import { TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { OSMTagTableRow } from './OSMTagTableRow'
import { StyledList } from './StyledList'
import { StyledTable } from './StyledTable'
import { tagsWithSemicolonSupport } from './config'
import { getOSMTagProps } from './getOSMTagProps'
import { valueRenderFunctions } from './tagging-schema/valueRenderFunctions'
import useAccessibilityAttributesIdMap from '../../../../lib/fetchers/ac/useAccessibilityAttributesIdMap'

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
};

export default function OSMTagTable(props: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
  isHorizontal?: boolean;
}) {
  const router = useRouter()
  const { ids } = router.query
  const { feature, isHorizontal, nestedTags } = props

  const languageTags = useCurrentLanguageTagStrings()
  const {
    map: attributesById,
  } = useAccessibilityAttributesIdMap(languageTags)

  const SurroundingListElement = isHorizontal ? StyledList : StyledTable
  return (
    <SurroundingListElement>
      {nestedTags.map(({ key, children }) => {
        const originalOSMTagValue = feature.properties[key] || ''
        let tagValues = []
        if (tagsWithSemicolonSupport.includes(key) && typeof originalOSMTagValue === 'string') {
          tagValues = originalOSMTagValue?.split(';') || []
        } else {
          tagValues = [originalOSMTagValue]
        }
        return tagValues.map((singleValue) => {
          const matchedKey = Object.keys(
            valueRenderFunctions,
          ).find((renderFunctionKey) => key.match(renderFunctionKey))
          const tagProps = getOSMTagProps({
            key,
            matchedKey,
            singleValue,
            ids,
            currentId: feature._id,
            languageTags,
            attributesById,
          })
          if (children?.length) {
            const nestedTable = (
              <OSMTagTable
                key={singleValue}
                feature={feature}
                nestedTags={children}
                isHorizontal={tagProps.isHorizontal}
              />
            )
            return (
              <OSMTagTableRow
                key={singleValue}
                keyName={singleValue}
                {...tagProps}
                valueElement={nestedTable}
                isHorizontal={isHorizontal}
              />
            )
          }
          return <OSMTagTableRow key={singleValue} {...tagProps} isHorizontal={isHorizontal} />
        })
      })}
    </SurroundingListElement>
  )
}
