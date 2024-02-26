import { Classes, Tag } from "@blueprintjs/core";
import styled from "styled-components";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import { EditButton } from "./EditButton";
import { OSMTagProps } from "./OSMTagProps";

const StyledListElement = styled.li`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export function OSMTagTableRow(
  {
    key,
    keyName,
    hasDisplayedKey,
    keyLabel,
    valueElement,
    isEditable,
    editURL,
    keyDetails,
    valueDetails,
    isHorizontal,
  }: OSMTagProps,
) {
  const valueIsNumeric = typeof valueElement === "string" &&
    valueElement.match(/^-?\d+(\.\d+)?$/);
  const displayedKey = hasDisplayedKey && (
    <th rowSpan={keyDetails ? 1 : 2}>{keyLabel}</th>
  );
  // const textAlign = valueIsNumeric ? 'right' : 'left';
  const valueIsString = typeof valueElement === "string";
  const ValueElement = isHorizontal ? Tag : "td";
  const displayedValue = (
    <ValueElement
      colSpan={hasDisplayedKey ? 1 : 2}
      style={{ paddingBottom: "0.25rem" }}
      minimal={true}
      large={true}
    >
      {valueIsString
        ? <StyledMarkdown inline={true}>{valueElement}</StyledMarkdown>
        : valueElement}
    </ValueElement>
  );

  const ListElementTag = isHorizontal ? StyledListElement : "tbody";
  const RowTag = isHorizontal ? "div" : "tr";
  const CellTag = isHorizontal ? "div" : "td";

  const detailElements = [keyDetails, valueDetails].filter(Boolean).map((
    details,
    i,
  ) => (
    <td colSpan={2}>
      <StyledMarkdown>
        {details}
      </StyledMarkdown>
    </td>
  ));

  const wrappedDetailElements = isHorizontal
    ? (
      detailElements
    )
    : (
      detailElements.map((element, i) => (
        <tr key={i}>
          {element}
        </tr>
      ))
    );

  return (
    <ListElementTag key={key} className={Classes.LABEL}>
      <RowTag className={keyName}>
        {displayedKey}
        {displayedValue}
        <CellTag style={{ textAlign: "right" }}>
          {isEditable && <EditButton editURL={editURL} />}
        </CellTag>
      </RowTag>
      {wrappedDetailElements}
    </ListElementTag>
  );
}
