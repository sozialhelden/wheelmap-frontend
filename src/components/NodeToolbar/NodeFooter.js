// @flow

import * as React from 'react';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import colors from '../../lib/colors';
import type { Feature } from '../../lib/Feature';
import type { Category } from '../../lib/Categories';
import { isWheelmapFeatureId, isWheelchairAccessible, hasAccessibleToilet } from '../../lib/Feature';

const editHintBackgroundColor = hsl(colors.linkColor).darker(0.5);
editHintBackgroundColor.s -= 0.5;

const StyledFooter = styled.footer`
  padding-top: 10px;

  .edit-hint {
    margin: -10px;
    padding: 0.25em 0.5em;
    font-size: 90%;
    font-weight: 300;
    opacity: 0.5;
    color: white;
    background: ${editHintBackgroundColor};
    border-radius: 0.25em;
    text-align: center;
    text-shadow: 0 0px 1px rgba(0, 0, 0, 0.5);
  }

  .link-button {
    color: ${colors.linkColor};
  }

  .edit-link-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;

    > * {
      flex: 2;
    }
    > .edit-hint-arrow {
      flex: 0;
    }
    > .edit-hint {
      position: relative;
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
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
        border-right-color: ${editHintBackgroundColor};
        box-sizing: border-box;
      }
    }
  }
`;


type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
};


export default function NodeFooter(props: Props) {
  const { feature, featureId } = props;
  const isWheelmap = isWheelmapFeatureId(featureId);

  let editHint = null;
  let needsContribution = false;
  let editButtonCaption = 'Mark this place';
  if (feature && feature.properties) {
    const properties = feature.properties;
    switch (isWheelchairAccessible(properties)) {
      case 'unknown':
        editHint = (<span className="edit-hint">Improve your karma!</span>);
        needsContribution = true;
        break;
      case 'limited':
      case 'yes':
        if (hasAccessibleToilet(properties) === 'unknown') {
          editHint = (<span className="edit-hint">Bonus karma points!</span>);
          needsContribution = true;
          editButtonCaption = 'Add toilet status';
        }
        break;
      default: break;
    }
  }

  return (
    <StyledFooter>
      {(isWheelmap && featureId) ?
        <div className="wheelmap-links">
          {needsContribution ? (<Link className="link-button edit-link-button" to={`/beta/nodes/${featureId}/edit`}>
            <span>{editButtonCaption}</span>{editHint || null}
          </Link>) : null}
          <a className="link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}`}>
            Details
          </a>
        </div> : null}
    </StyledFooter>
  );
}
