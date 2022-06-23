import {
  HTML_TABLE,
  HTML_TABLE_CONDENSED,
  HTML_TABLE_STRIPED,
} from "@blueprintjs/core/lib/esm/common/classes";
import React from "react";
import styled from "styled-components";
import Feature from "../../../model/Feature";

const StyledTable = styled("table")`
  background-color: rgba(0, 0, 0, 0.05);
  margin: 1rem 0;
`;

export default function OSMTagTable(props: {
  keys: string[];
  feature: Feature;
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
