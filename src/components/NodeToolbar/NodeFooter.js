// @flow

import { t } from 'c-3po';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import colors from '../../lib/colors';
import type { Feature } from '../../lib/Feature';
import {
  hasAccessibleToilet,
  isWheelchairAccessible,
} from '../../lib/Feature';

const editHintBackgroundColor = hsl(colors.linkColor).darker(0.5);
editHintBackgroundColor.s -= 0.5;

const StyledFooter = styled.footer`
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate3d(-2px, 0, 0);
    }
    100% {
      opacity: 1.0;
      transform: translate3d(0, 0, 0);
    }
  }


  .edit-hint {
    margin: -10px;
    padding: 0.25em 0.5em;
    font-size: 90%;
    font-weight: 300;
    opacity: 0;
    color: white;
    background: ${editHintBackgroundColor};
    border-radius: 0.25em;
    text-align: center;
    text-shadow: 0 0px 1px rgba(0, 0, 0, 0.5);
    animation: slideIn 1.5s 1s ease-out forwards;
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
      flex: 1;
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
};


export default class NodeFooter extends React.Component<Props> {
  focus() {
    if (this.contributionLink) {
      this.contributionLink.focus()
    }
  }

  render() {
    const { feature, featureId } = this.props;

    let editHint = null;
    let needsContribution = false;

    // translator: Button caption in the place toolbar
    let editButtonCaption = t`Mark this place`;

    if (feature && feature.properties) {
      const properties = feature.properties;

      // translator: Text that incentivizes the user to edit a place's accessibility.
      const basicAccessibilityEditHint = t`Improve your karma!`;

      // translator: Text that incentivizes the user to edit a place's toilet accessibility.
      const toiletEditHint = t`Bonus karma points!`;

      switch (isWheelchairAccessible(properties)) {
        case 'unknown':
          editHint = (<span className="edit-hint">{basicAccessibilityEditHint}</span>);
          needsContribution = true;
          break;
        case 'limited':
        case 'yes':
          if (hasAccessibleToilet(properties) === 'unknown') {
            editHint = (<span className="edit-hint">{toiletEditHint}</span>);
            needsContribution = true;
            // translator: Button caption, shown in the place toolbar
            editButtonCaption = t`Add toilet status`;
          }
          break;
        default: break;
      }
    }

    let contributionLink = null;
    if (needsContribution && featureId) {
      contributionLink = (<Link
        ref={contributionLinkInstance => this.contributionLink = findDOMNode(contributionLinkInstance)}
        className="link-button edit-link-button"
        to={`/beta/nodes/${featureId}/edit`}
        role="button"
        aria-label={editButtonCaption}
      >
        <span>{editButtonCaption}</span>{editHint || null}
      </Link>);
    }

    return (
      <StyledFooter>
        <div className="wheelmap-links">
          {contributionLink}
        </div>
      </StyledFooter>
    );
  }
}
