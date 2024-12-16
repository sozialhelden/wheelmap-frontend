import { Tooltip } from "@radix-ui/themes";
import styled from "styled-components";
import { horizontalKeys } from "../../../../lib/model/osm/tag-config/horizontalKeys";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import { EditButton } from "./EditButton";
import type { OSMTagProps } from "./OSMTagProps";
import StyledTag from "./StyledTag";

const StyledListElement = styled.li`
  list-style: none;
  padding: 0;
  margin: 0;

  ${StyledTag} {
    flex-direction: row;
  }

  header {
    display: inline-flex;
    font-weight: 500;
  }
`;

export function OSMTagTableRowOrListElement({
  tagKey,
  hasDisplayedKey,
  keyLabel,
  valueElement,
  isEditable,
  editURL,
  keyDetails,
  valueDetails,
  isHorizontal,
}: OSMTagProps) {
  // Baseline alignment for keys that display a list of horizontal tags
  const keyStyle = horizontalKeys.has(tagKey) ? { paddingTop: "0.55rem" } : {};

  const HeaderElement = isHorizontal ? "header" : "th";

  const displayedKey = hasDisplayedKey && (
    <HeaderElement rowSpan={keyDetails ? 1 : 2} style={keyStyle}>
      {keyLabel}
    </HeaderElement>
  );

  const detailElements = [keyDetails, valueDetails].filter(Boolean);
  const hasDetails = detailElements.length > 0;

  const detailElementsContained = hasDetails && (
    <div style={{ maxWidth: "30rem", padding: ".5rem" }}>
      {detailElements.length === 1 && (
        <StyledMarkdown>{detailElements[0]}</StyledMarkdown>
      )}
      {detailElements.length > 1 && (
        <ul>
          {detailElements.map((element, i) => (
            <li key={i}>
              <StyledMarkdown>{element}</StyledMarkdown>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const valueIsString = typeof valueElement === "string";
  const valueIsNumber = typeof valueElement === "number";
  const editButton = isEditable && <EditButton editURL={editURL} />;

  const displayedValueContent = valueIsString ? (
    <span
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: ".5rem",
      }}
    >
      {valueIsNumber ? String(valueElement) : null}
      {valueIsString ? (
        <StyledMarkdown
          inline
          style={{ textDecoration: hasDetails ? "underline dotted" : "none" }}
        >
          {valueElement}
        </StyledMarkdown>
      ) : null}
      {!valueIsNumber && !valueIsString && valueElement}
      {editButton}
    </span>
  ) : (
    <>
      <span>{valueElement}</span> {editButton}
    </>
  );

  const displayedValueContentWithTooltip = hasDetails ? (
    <Tooltip content={detailElementsContained}>{displayedValueContent}</Tooltip>
  ) : (
    displayedValueContent
  );

  const valueElementStyle = {
    paddingBottom: "0.25rem",
    cursor: hasDetails ? "help" : "auto",
  };
  const displayedValue = isHorizontal ? (
    displayedValueContentWithTooltip
  ) : (
    <td colSpan={hasDisplayedKey ? 1 : 2} style={valueElementStyle}>
      {displayedValueContentWithTooltip}
    </td>
  );

  const ListElementTag = isHorizontal ? StyledListElement : "tbody";
  const RowTag = isHorizontal ? "div" : "tr";
  const CellTag = isHorizontal ? "div" : "td";
  const content = (
    <>
      {displayedKey}
      {displayedValue}
      {!isHorizontal && <CellTag style={{ textAlign: "right" }} />}
    </>
  );
  const maybeWrappedContent = isHorizontal ? (
    <StyledTag minimal large round>
      {content}
    </StyledTag>
  ) : (
    <RowTag className={tagKey}>{content}</RowTag>
  );
  return (
    <ListElementTag key={tagKey} className={tagKey}>
      {maybeWrappedContent}
    </ListElementTag>
  );
}
