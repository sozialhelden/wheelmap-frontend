// @flow

import marked from 'marked';
import * as React from 'react';
import Description from './Description';
import { translatedStringFromObject } from '../../../lib/i18n';

interface AccessibleDescriptionInterface {
  description?: string;
  longDescription?: string; // can be read out aloud by a voice assistant, does not contain abbreviations or special characters
  shortDescription?: string; // can be shortened, makes more sense visually
}

type Props = {
  properties: AccessibleDescriptionInterface, // eslint-disable-line react/no-unused-prop-types
  className?: string,
};

/**
 * Places and equipment can have 3 description variants in different lengths, optimized for
 * visual display and screen readers. This component uses this information to show the visually
 * most appealing variant and adds an ARIA label that is readable aloud, if possible.
 */
export default function AccessibleDescription(props: Props) {
  const properties = props.properties;
  if (!properties) return null;
  const { description, longDescription, shortDescription } = properties;

  const descriptionText = shortDescription || description || longDescription;

  if (!descriptionText) return null;

  const string = translatedStringFromObject(descriptionText);
  const hasQuotes = string && !string.match('#') && !string.match('\n') && !string.match('<');
  const markdownHTML = marked(string).trim();
  const __html = markdownHTML.replace(/^<p>(.*)<\/p>$/, '$1');
  return (
    <Description
      className={(props.className || '') + (hasQuotes ? ' has-quotes' : '')}
      dangerouslySetInnerHTML={{ __html }}
    ></Description>
  );
}
