import { Button } from "@blueprintjs/core";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";

const StyledTable = styled.table`
  background-color: rgba(255, 255, 255, 1);
  margin: 1rem 0;
  border-radius: 0.5rem;
  padding: 0.25rem 0;
  border: 1px solid rgba(16, 22, 26, 0.15);
`;

// function humanizeOSMTag(tag: string) {
//   switch(tag) {
//     case 'wheelchair':
//       return t`Wheelchair accessibility`;
//     case 'wheelchair:description':
//       return t`Wheelchair accessibility description`;
//     case 'wheelchair:toilet':
//       return t`Wheelchair accessible toilet`;
//   // return humanizeThroughInflection(tag.replace(/:/g, ' '));
// }

export default function OSMTagTable(props: {
  keys: string[];
  feature: TypeTaggedOSMFeature;
}) {
  return (
    <StyledTable
      className="bp4-html-table bp4-html-table-striped bp4-html-table-condensed"
    >
      {props.keys.map((k) => (
        <tr key={k}>
          <th>{k}</th>
          <td>{props.feature.properties[k]}</td>
          <td>
            <Link href={`composite/`}>
              <Button aria-label={t`Edit`} icon="edit" minimal small />
            </Link>
          </td>
        </tr>
      ))}
    </StyledTable>
  );
}
