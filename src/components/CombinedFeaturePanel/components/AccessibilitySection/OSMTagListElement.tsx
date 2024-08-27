import React from 'react';
import StyledMarkdown from '../../../shared/StyledMarkdown';
import { OSMTagProps } from './OSMTagProps';
import { EditButton } from './EditButton';

export function OSMTagListElement(
  {
    key, hasDisplayedKey, keyLabel, valueElement: valueLabel, isEditable, editURL, valueDetails: shownDetailsLine,
  }: OSMTagProps,
) {
  return (
    <li key={key}>
      <header>{hasDisplayedKey && keyLabel}</header>
      {valueLabel && valueLabel !== '' && typeof valueLabel === 'string'
        ? (
          <header>
            <StyledMarkdown inline>{valueLabel}</StyledMarkdown>
          </header>
        )
        : <header>{valueLabel}</header>}

      {isEditable && <EditButton editURL={editURL} />}

      {shownDetailsLine && shownDetailsLine !== '' && (
        <footer>
          <StyledMarkdown>
            {shownDetailsLine}
          </StyledMarkdown>
        </footer>
      )}
    </li>
  );
}
