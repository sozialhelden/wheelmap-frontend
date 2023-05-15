import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LanguageTagContext";
import { useAccessibilityAttributesIdMap } from "../../../../lib/fetchers/fetchAccessibilityAttributes";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import { tagsWithSemicolonSupport } from "./config";
import { getOSMTagProps } from "./getOSMTagProps";
import { OSMTagTableRow } from "./OSMTagTableRow";
import DisplayedQuantity from "./tags/values/DisplayedQuantity";
import OpeningHoursValue from "./tags/values/OpeningHoursValue";

const StyledTable = styled.table`
  th {
    text-align: left;
    vertical-align: top;
    padding-right: 1rem !important;
  }

  th {
    font-weight: 500;
  }

  th,
  td,
  tbody {
    p:first-child {
      margin-top: 0;
    }
    margin: 0;
    padding: 0.25rem 0;
  }

  table {
    margin: 0;
    padding: 0;
    border: 0;
    border-spacing: 0px;
    border-collapse: separate;

    th,
    td {
      padding: 0;
      margin: 0;
      border: none;
    }
  }
`;

type ValueRenderProps = {
  value: string;
  matches: RegExpMatchArray;
};

export const valueRenderFunctions: Record<
  string,
  (props: ValueRenderProps) => React.ReactNode
> = {
  opening_hours: (props) => <OpeningHoursValue value={props.value} />,
  "opening_hours:(atm|covid19|drive_through|kitchen|lifeguard|office|pharmacy|reception|store|workshop)":
    (props) => <OpeningHoursValue value={props.value} />,
  "step_height": (props) => <DisplayedQuantity value={props.value} defaultUnit="cm" />,
  "entrance_width": (props) => <DisplayedQuantity value={props.value} defaultUnit="cm" />,
  "width": (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  "height": (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  "depth": (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  "power_supply:voltage": (props) => <DisplayedQuantity value={props.value} defaultUnit="V" />,
  "power_supply:current": (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  "power_supply:maxcurrent": (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  "power_supply:frequency": (props) => <DisplayedQuantity value={props.value} defaultUnit="Hz" />,
  "(?:socket:([\w_]+):)?amperage": (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  "(?:socket:([\w_]+):)?maxamperage": (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  "(?:socket:([\w_]+):)?voltage": (props) => <DisplayedQuantity value={props.value} defaultUnit="V" />,
  "(?:socket:([\w_]+):)?output": (props) => <DisplayedQuantity value={props.value} defaultUnit="W" />,
  "(?:([\w_]+):)?description(?:(\w\w))?": (props) => {
    const text = props.value;
    const targetGroup = props.matches[1];
    const lang = props.matches[2];
    return <p lang={lang}>{t`“${text}”`}</p>;
  },
};

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
};

export default function OSMTagTable(props: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
}) {
  const router = useRouter();
  const { ids, id } = router.query;
  const { feature } = props;

  const appToken = useCurrentAppToken();
  const languageTags = useCurrentLanguageTagStrings();
  const {
    data: attributesById,
    isValidating,
  } = useAccessibilityAttributesIdMap(languageTags, appToken);

  return (
    <StyledTable>
      {props.nestedTags.map(({ key, children }) => {
        const originalOSMTagValue = feature.properties[key] || "";
        const tagValues = tagsWithSemicolonSupport.includes(key)
          ? originalOSMTagValue?.split(";") || []
          : [originalOSMTagValue];
        return tagValues.map((singleValue) => {
          const matchedKey = Object.keys(
            valueRenderFunctions
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
              />
            );
            return (
              <OSMTagTableRow
                key={singleValue}
                {...tagProps}
                valueElement={nestedTable}
              />
            );
          } else {
            return <OSMTagTableRow key={singleValue} {...tagProps} />;
          }
        });
      })}
    </StyledTable>
  );
}
