// @flow

import React from 'react';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import colors from '../../lib/colors';
import type { Feature } from '../../lib/Feature';
import { isWheelmapFeatureId, isWheelchairAccessible, hasAccessibleToilet } from '../../lib/Feature';
import ShareButtons from './ShareButtons';
import type { Category } from '../../lib/Categories';

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
      flex: 2;
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
  if (feature && feature.properties) {
    const properties = feature.properties;
    switch (isWheelchairAccessible(properties)) {
      case 'unknown':
        editHint = (<span className="edit-hint">Help out by marking this place!</span>);
        break;
      case 'limited':
      case 'yes':
        if (hasAccessibleToilet(properties) === 'unknown') {
          editHint = (<span className="edit-hint">Help out by marking the toilet status!</span>);
        }
        break;
      default: break;
    }
  }

  return (
    <StyledFooter>
      {(isWheelmap && featureId) ?
        <div className="wheelmap-links">
          <a className="link-button edit-link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}/edit`}>
            <span>Edit</span>{editHint || null}
          </a>
          <a className="link-button" href={`https://www.wheelmap.org/de/nodes/${featureId}`}>
            Details
          </a>
        </div> : null}
      <ShareButtons {...props} />
    </StyledFooter>
  );
}
