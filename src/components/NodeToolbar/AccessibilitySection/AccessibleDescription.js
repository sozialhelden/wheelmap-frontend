// @flow

import styled from 'styled-components';
import * as React from 'react';

interface AccessibleDescriptionInterface {
  description?: string,
  longDescription?: string, // can be read out aloud by a voice assistant, does not contain abbreviations or special characters
  shortDescription?: string, // can be shortened, makes more sense visually
};

type Props = {
  properties: AccessibleDescriptionInterface, // eslint-disable-line react/no-unused-prop-types
  className: string,
};


function AccessibleDescription(props: Props) {
  const properties = props.properties;
  if (!properties) return null;
  const { description, longDescription, shortDescription } = properties;
  if (!description && !longDescription && !shortDescription) return null;

  return <p
    className={props.className}
    aria-label={longDescription || description || shortDescription}
  >
    {shortDescription || description || longDescription}
  </p>;
}


const StyledAccessibleDescription = styled(AccessibleDescription)`

`;


export default StyledAccessibleDescription;
