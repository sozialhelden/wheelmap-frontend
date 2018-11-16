// @flow

import * as React from 'react';
import WorldIcon from '../../icons/actions/World';
import styled from 'styled-components';

const NonBreakingLink = styled.a`
  svg {
    width: 1.25rem !important;
    height: 1.25rem !important;
    margin-left: 0.25rem;
    margin-right: 1.25rem;
  }
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 3rem);
  }
`;

type Props = {
  feature: ?Feature,
};

export default function PlaceWebsiteLink(props: Props) {
  const { feature } = props;
  const { properties } = feature || {};
  if (!properties) return null;
  const placeWebsiteUrl = properties.placeWebsiteUrl || properties.website;

  return (
    typeof placeWebsiteUrl === 'string' && (
      <NonBreakingLink
        className="link-button"
        href={placeWebsiteUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        <WorldIcon />
        <span>{placeWebsiteUrl}</span>
      </NonBreakingLink>
    )
  );
}
