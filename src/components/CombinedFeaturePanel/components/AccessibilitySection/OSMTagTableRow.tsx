import React from "react";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import { OSMTagProps } from "./OSMTagProps";
import { EditButton } from "./EditButton";

export function OSMTagTableRow(
  {
    key, hasDisplayedKey, keyLabel, valueElement, isEditable, editURL, shownDetailsLine,
  }: OSMTagProps
) {
  return (
    <tbody key={key}>
      <tr>
        {hasDisplayedKey && <th rowSpan={2}>{keyLabel}</th>}
        {valueElement && valueElement !== "" && typeof valueElement === "string"
          ? (
            <th colSpan={hasDisplayedKey ? 1 : 2}>
              <StyledMarkdown inline={true}>{valueElement}</StyledMarkdown>
            </th>
          )
          : <td colSpan={hasDisplayedKey ? 1 : 2}>{valueElement}</td>}

        <td style={{ textAlign: "right" }}>
          {isEditable && <EditButton editURL={editURL} />}
        </td>
      </tr>

      {shownDetailsLine && shownDetailsLine !== "" && (
        <tr>
          <td colSpan={2}>
            <StyledMarkdown>
              {shownDetailsLine}
            </StyledMarkdown>
          </td>
        </tr>
      )}
    </tbody>
  );
}
