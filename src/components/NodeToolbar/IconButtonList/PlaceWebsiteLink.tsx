import * as React from 'react';
import WorldIcon from '../../icons/actions/World';
import styled from 'styled-components';
import { Feature, isWheelmapProperties } from '../../../lib/Feature';

const NonBreakingLink = styled.a`
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 3rem);
  }
`;

type Props = {
  feature: Feature | null,
};

export default function PlaceWebsiteLink(props: Props) {
  const { feature } = props;
  const { properties } = feature || {};
  if (!properties) return null;

  let placeWebsiteUrl = null
  if (!isWheelmapProperties(properties)) {
    placeWebsiteUrl = properties.placeWebsiteUrl;
  } else {
    placeWebsiteUrl = properties.website;
  }

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
