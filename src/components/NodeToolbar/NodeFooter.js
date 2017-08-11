// @flow

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Feature } from '../../lib/Feature';
import { isWheelmapFeatureId, isWheelchairAccessible, hasAccessibleToilet } from '../../lib/Feature';
import colors from '../../lib/colors';


const StyledFooter = styled.footer`
  padding-top: 10px;

  .edit-hint {
    padding: 0.25em 0.5em;
    font-size: 90%;
    opacity: 0.5;
    color: white;
    background-color: ${colors.darkSelectedColor};
    border-radius: 0.25em;
  }

  a.edit-link-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > * {
      flex: 2;
    }
    > .edit-hint-arrow {
      flex: 0;
    }
    > .edit-hint {
      position: relative;
      flex: 3;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: -16px;
        top: 50%;
        margin-top: -8px;
        width: 16px;
        height: 16px;
        border: 8px solid transparent;
        border-right-color: ${colors.darkSelectedColor};
        box-sizing: border-box;
      }
    }
  }
`;


type Props = {
  feature: Feature,
  featureId: string | number | null,
};


export default function NodeFooter({ feature, featureId }: Props) {
  const isWheelmap = isWheelmapFeatureId(featureId);

  let editHint = null;
  if (feature && feature.properties) {
    switch (isWheelchairAccessible(feature.properties)) {
      case 'unknown':
        editHint = (<span className='edit-hint'>Help out by marking this place!</span>);
        break;
      case 'limited':
      case 'yes':
        if (hasAccessibleToilet(feature.properties) === 'unknown') {
          editHint = (<span className='edit-hint'>Help out by marking the toilet status!</span>);
        }
        break;
      default: break;
    }
  }

  return (
    <StyledFooter>
      {isWheelmap ?
        <div className="wheelmap-links">
          <a className="link-button edit-link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}/edit`}>
            <span>Edit</span>{editHint}
          </a>
          <a className="link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}`}>
            Details
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
