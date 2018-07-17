// @flow

import { t } from 'c-3po';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import colors from '../../lib/colors';
import type { Feature } from '../../lib/Feature';
import {
  hasAccessibleToilet,
  isWheelchairAccessible,
} from '../../lib/Feature';
import { IncentiveHint } from './IncentiveHint';


const StyledEditLinks = styled.footer`
  margin-top: 1rem;

  .link-button {
    color: ${colors.linkColor};

    > span {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .edit-link-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    font-weight: bold;

    > * {
      flex: 2;
    }
  }

  .incentive-hint {
    margin: -5px -5px -5px 10px;
  }
`;


type Props = {
  feature: ?Feature,
  featureId: string | number | null,
};


export default class EditLinks extends React.Component<Props> {
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
    let contributionType = 'wheelchair';

    if (feature && feature.properties) {
      const properties = feature.properties;

      // translator: Text that incentivizes the user to edit a place's accessibility.
      const basicAccessibilityEditHint = t`Improve your karma!`;

      // translator: Text that incentivizes the user to edit a place's toilet accessibility.
      const toiletEditHint = t`Bonus karma points!`;

      switch (isWheelchairAccessible(properties)) {
        case 'unknown':
          editHint = (<IncentiveHint>{basicAccessibilityEditHint}</IncentiveHint>);
          needsContribution = true;
          break;
        case 'limited':
        case 'yes':
          if (hasAccessibleToilet(properties) === 'unknown') {
            editHint = (<IncentiveHint>{toiletEditHint}</IncentiveHint>);
            needsContribution = true;
            // translator: Button caption, shown in the place toolbar
            editButtonCaption = t`Add toilet status`;
            contributionType = 'toilet';
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
        to={`/beta/nodes/${featureId}/edit-${contributionType}-accessibility`}
        role="button"
        aria-label={editButtonCaption}
      >
        <span>{editButtonCaption}</span>{editHint || null}
      </Link>);
    }

    return (
      <StyledEditLinks>
        <div className="wheelmap-links">
          {contributionLink}
        </div>
      </StyledEditLinks>
    );
  }
}
