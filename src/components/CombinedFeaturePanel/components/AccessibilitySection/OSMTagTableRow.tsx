import React from "react";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import { OSMTagProps } from "./OSMTagProps";
import { EditButton } from "./EditButton";
import { isNumber } from "lodash";

export function OSMTagTableRow(
  {
    key, hasDisplayedKey, keyLabel, valueElement, isEditable, editURL, keyDetails, valueDetails,
  }: OSMTagProps
) {
  const valueIsNumeric = typeof valueElement === 'string' && valueElement.match(/^-?\d+(\.\d+)?$/);
  return (
    <tbody key={key}>
      <tr>
        {hasDisplayedKey && <th rowSpan={keyDetails ? 1 : 2}>{keyLabel}</th>}
        {valueElement && valueElement !== "" && typeof valueElement === "string"
          ? (
            <th colSpan={hasDisplayedKey ? 1 : 2} style={{ textAlign: valueIsNumeric ? 'right' : 'left' }}>
              <StyledMarkdown inline={true}>{valueElement}</StyledMarkdown>
            </th>
          )
          : <td colSpan={hasDisplayedKey ? 1 : 2} style={{ textAlign: valueIsNumeric ? 'right' : 'left' }}>{valueElement}</td>}

        <td style={{ textAlign: "right" }}>
          {isEditable && <EditButton editURL={editURL} />}
        </td>
      </tr>

      {valueDetails && valueDetails !== "" && (
        <tr>
          <td colSpan={2}>
            <StyledMarkdown>
              {valueDetails}
            </StyledMarkdown>
          </td>
        </tr>
      )}

      {keyDetails && keyDetails !== "" && (
        <tr>
          <td colSpan={2}>
            <StyledMarkdown>
              {keyDetails}
            </StyledMarkdown>
          </td>
        </tr>
      )}
    </tbody>
  );
}
