import React from 'react'
import StyledMarkdown from '../../../shared/StyledMarkdown'
import { OSMTagProps } from './OSMTagProps'
import { EditButton } from './EditButton'

export function OSMTagListElement(
  {
    key, hasDisplayedKey, keyLabel, valueElement: valueLabel, isEditable, editURL, valueDetails: shownDetailsLine,
  }: OSMTagProps,
) {
  const editButton = isEditable && <EditButton editURL={editURL} />;

  return (
    <li key={key}>
      <header>{hasDisplayedKey && keyLabel}</header>
      {valueLabel && valueLabel !== '' && typeof valueLabel === 'string'
        ? (
          <header>
            <StyledMarkdown inline>{valueLabel}</StyledMarkdown>
            {editButton}
          </header>
        )
        : <header>{valueLabel} {editButton}</header>}

      {shownDetailsLine && shownDetailsLine !== '' && (
        <footer>
          <StyledMarkdown>
            {shownDetailsLine}
          </StyledMarkdown>
        </footer>
      )}
    </li>
  )
}
