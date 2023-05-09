import { Button, HTMLTable } from "@blueprintjs/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import colors from "../../../../lib/colors";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import { getOSMTagProps } from "./getOSMTagProps";
import { OSMTagTableRow } from "./OSMTagTableRow";
import OpeningHoursValue from "./tags/values/OpeningHoursValue";

const StyledTable = styled.table`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(16, 22, 26, 0.15);
  color: ${colors.textColorTonedDownSlightly};

  th {
    text-align: left;
    vertical-align: top;
    padding-right: 1rem;
  }

  th, td, tbody {
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

    th, td {
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
  "wheelchair:description(?:(\w\w))?": (props) => {
    const text = props.value;
    const lang = props.matches[1];
    return <p lang={lang}>{t`“${text}”`}</p>;
  },
};

export const editableKeys = new Set([
  "wheelchair",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
  "toilets:wheelchair",
]);

export type TagOrTagGroup = {
  key: string;
  children: TagOrTagGroup[];
}


export default function OSMTagTable(props: {
  nestedTags: TagOrTagGroup[];
  feature: TypeTaggedOSMFeature;
}) {
  const router = useRouter();
  const { ids, id } = router.query;
  const { feature } = props;

  return (
    <StyledTable>
      {props.nestedTags.map(({ key, children }) => {
        const tagProps = getOSMTagProps({ key, feature, ids });
        if (children?.length) {
          const nestedTable = <OSMTagTable feature={feature} nestedTags={children} />;
          return <OSMTagTableRow {...tagProps} valueElement={nestedTable} />;
        } else {
          return <OSMTagTableRow {...tagProps} />;
        }
      })}
    </StyledTable>
  );
}
