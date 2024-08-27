import { useRouter } from 'next/router';
import { useCurrentAppToken } from '../../../../lib/context/AppContext';
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext';
import { useAccessibilityAttributesIdMap } from '../../../../lib/fetchers/fetchAccessibilityAttributes';
import { TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature';
import { OSMTagTableRow } from './OSMTagTableRow';
import { StyledList } from './StyledList';
import { StyledTable } from './StyledTable';
import { tagsWithSemicolonSupport } from './config';
import { getOSMTagProps } from './getOSMTagProps';
import { valueRenderFunctions } from './tagging-schema/valueRenderFunctions';

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
};

export default function OSMTagTable(props: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
  isHorizontal?: boolean;
}) {
  const router = useRouter();
  const { ids } = router.query;
  const { feature } = props;

  const appToken = useCurrentAppToken();
  const languageTags = useCurrentLanguageTagStrings();
  const {
    data: attributesById,
    isValidating,
  } = useAccessibilityAttributesIdMap(languageTags, appToken);

  const SurroundingListElement = props.isHorizontal ? StyledList : StyledTable;
  return (
    <SurroundingListElement>
      {props.nestedTags.map(({ key, children }) => {
        const originalOSMTagValue = feature.properties[key] || '';
        const tagValues = tagsWithSemicolonSupport.includes(key)
          ? originalOSMTagValue?.split(';') || []
          : [originalOSMTagValue];
        return tagValues.map((singleValue) => {
          const matchedKey = Object.keys(
            valueRenderFunctions,
          ).find((renderFunctionKey) => key.match(renderFunctionKey));
          const tagProps = getOSMTagProps({
            key,
            matchedKey,
            singleValue,
            ids,
            currentId: feature._id,
            languageTags,
            attributesById,
          });
          if (children?.length) {
            const nestedTable = (
              <OSMTagTable
                key={singleValue}
                feature={feature}
                nestedTags={children}
                isHorizontal={tagProps.isHorizontal}
              />
            );
            return (
              <OSMTagTableRow
                key={singleValue}
                keyName={singleValue}
                {...tagProps}
                valueElement={nestedTable}
                isHorizontal={props.isHorizontal}
              />
            );
          }
          return <OSMTagTableRow key={singleValue} {...tagProps} isHorizontal={props.isHorizontal} />;
        });
      })}
    </SurroundingListElement>
  );
}
