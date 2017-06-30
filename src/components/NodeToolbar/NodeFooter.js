// @flow

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Feature } from '../../lib/Feature';
import { isWheelmapFeatureId } from '../../lib/Feature';


const StyledFooter = styled.footer`
    padding-top: 10px;
`;


type Props = {
  feature: Feature,
  featureId: string | number | null,
};


export default function NodeFooter({ feature, featureId }: Props) {
  const isWheelmap = isWheelmapFeatureId(featureId);

  return (
    <StyledFooter>
      {isWheelmap ?
        <div className="wheelmap-links">
          <a className="link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}`}>
            Details
          </a>
          <a className="link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}/edit`}>
            Edit
          </a>
        </div> : null}

      <Link to="/" className="link-button">
        Share
      </Link>

      <Link to="/" className="link-button">
        Report Problem
      </Link>
    </StyledFooter>
  );
}
