import { Classes, Tag, Tooltip } from '@blueprintjs/core'
import styled from 'styled-components'
import StyledMarkdown from '../../../shared/StyledMarkdown'
import { EditButton } from './EditButton'
import { OSMTagProps } from './OSMTagProps'
import { horizontalKeys } from '../../../../lib/model/osm/tag-config/horizontalKeys'

const StyledListElement = styled.li`
  list-style: none;
  padding: 0;
  margin: 0;
`

const StyledTag = styled(Tag)`
  background-color: #fca0ff2c !important;
  color: #7700b3 !important;
`;

export function OSMTagTableRowOrListElement(
  {
    tagKey,
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
  // Baseline alignment for keys that display a list of horizontal tags
  const keyStyle = horizontalKeys.has(tagKey) ? { paddingTop: '0.55rem' } : {};

  const displayedKey = hasDisplayedKey && (
    <th rowSpan={keyDetails ? 1 : 2} style={keyStyle}>
      {keyLabel}
    </th>
  )

  const detailElements = [keyDetails, valueDetails].filter(Boolean)
  const hasDetails = detailElements.length > 0

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
  )

  const valueIsString = typeof valueElement === 'string'
  const editButton = isEditable && <EditButton editURL={editURL} />;
  const displayedValueContent =
    valueIsString
    ? <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
        <StyledMarkdown inline style={{ textDecoration: hasDetails ? 'underline dotted' : 'none' }}>{valueElement}</StyledMarkdown>
        {editButton}
      </span>
    : <>{valueElement} {editButton}</>;
  const displayedValueContentWithTooltip = hasDetails ? (
    <Tooltip content={detailElementsContained} lazy compact>
      {displayedValueContent}
    </Tooltip>
  ) : displayedValueContent;

  const valueElementStyle = { paddingBottom: '0.25rem', cursor: hasDetails ? 'help' : 'auto' };
  const displayedValue = isHorizontal
  ? (
    <StyledTag
      minimal
      large
      round
    >
      {displayedValueContentWithTooltip}
    </StyledTag>
  )
  : (
    <td
      colSpan={hasDisplayedKey ? 1 : 2}
      style={valueElementStyle}
    >
      {displayedValueContentWithTooltip}
    </td>
  );

  const ListElementTag = isHorizontal ? StyledListElement : 'tbody'
  const RowTag = isHorizontal ? 'div' : 'tr'
  const CellTag = isHorizontal ? 'div' : 'td'

  return (
    <ListElementTag key={tagKey} className={Classes.LABEL}>
      <RowTag className={tagKey}>
        {displayedKey}
        {displayedValue}
        <CellTag style={{ textAlign: 'right' }} />
      </RowTag>
    </ListElementTag>
  )
}
