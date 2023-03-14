import {
  HTML_TABLE,
  HTML_TABLE_CONDENSED,
  HTML_TABLE_STRIPED,
} from "@blueprintjs/core/lib/esm/common/classes";
import React from "react";
import styled from "styled-components";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";

const StyledTable = styled("table")`
  background-color: rgba(255, 255, 255, 1);
  margin: 1rem 0;
  border-radius: 0.5rem;
  padding: 0.25rem 0;
  border: 1px solid rgba(16, 22, 26, 0.15);
`;

export default function OSMTagTable(props: {
  keys: string[];
  feature: TypeTaggedOSMFeature;
}) {
  return (
    <StyledTable
      className={[HTML_TABLE, HTML_TABLE_STRIPED, HTML_TABLE_CONDENSED].join(
        " "
      )}
    >
      {props.keys.map((k) => (
        <tr key={k}>
          <th>{k}</th>
          <td>{props.feature.properties[k]}</td>
        </tr>
      ))}
    </StyledTable>
  );
}
