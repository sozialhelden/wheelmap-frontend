import { Classes, Tag, Tooltip } from '@blueprintjs/core';
import styled from 'styled-components';
import StyledMarkdown from '../../../shared/StyledMarkdown';
import { EditButton } from './EditButton';
import { OSMTagProps } from './OSMTagProps';

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
  const displayedKey = hasDisplayedKey && (
    <th rowSpan={keyDetails ? 1 : 2}>{keyLabel}</th>
  );

  const detailElements = [keyDetails, valueDetails].filter(Boolean);
  const hasDetails = detailElements.length > 0;

  const detailElementsContained = hasDetails && (
  <div style={{ maxWidth: '30rem', padding: '.5rem' }}>
    {detailElements.length === 1 && <StyledMarkdown>{detailElements[0]}</StyledMarkdown>}
    {detailElements.length > 1 && (
    <ul>
      {detailElements.map((element, i) => (
        <li key={i}>
          <StyledMarkdown>
            {element}
          </StyledMarkdown>
        </li>
      ))}
    </ul>
    )}
  </div>
  );

  const valueIsString = typeof valueElement === 'string';
  const ValueElement = isHorizontal ? Tag : 'td';
  const displayedValueContent = (
    <>
      {valueIsString
        ? <StyledMarkdown inline style={{ textDecoration: hasDetails ? 'underline dotted' : 'none' }}>{valueElement}</StyledMarkdown>
        : valueElement}
      {isEditable && <EditButton editURL={editURL} />}
    </>
  );

  const displayedValue = (
    <ValueElement
      colSpan={hasDisplayedKey ? 1 : 2}
      style={{ paddingBottom: '0.25rem', cursor: hasDetails ? 'help' : 'auto' }}
      minimal
      large
    >
      {hasDetails ? (
        <Tooltip content={detailElementsContained} lazy compact>
          {displayedValueContent}
        </Tooltip>
      ) : displayedValueContent}
    </ValueElement>
  );

  const ListElementTag = isHorizontal ? StyledListElement : 'tbody';
  const RowTag = isHorizontal ? 'div' : 'tr';
  const CellTag = isHorizontal ? 'div' : 'td';

  return (
    <ListElementTag key={key} className={Classes.LABEL}>
      <RowTag className={keyName}>
        {displayedKey}
        {displayedValue}
        <CellTag style={{ textAlign: 'right' }} />
      </RowTag>
    </ListElementTag>
  );
}
