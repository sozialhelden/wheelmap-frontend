// @flow

import React from 'react';
import styled from 'styled-components';
import { isWheelchairAccessible, hasAccessibleToilet } from '../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../lib/Feature';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';
import colors from '../../lib/colors';


const CheckmarkIcon = () => (<svg width="16px" height="14px" viewBox="0 0 16 14" version="1.1" className="checkmark-icon">
  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <polygon id="checkmark" fill="#000000" points="4.51565378 13.174954 0 8.67495396 1.76887661 7 4.51565378 9.73112339 14.2311234 0 16 1.67495396 6.23756906 11.5313076" />
  </g>
</svg>);


function accessibilityName(accessibility: YesNoLimitedUnknown) {
  switch (accessibility) {
    case 'yes': return <span><span>Accessible with wheelchair</span> <CheckmarkIcon /></span>;
    case 'limited': return <span>Partially wheelchair accessible</span>;
    case 'no': return <span>Not accessible with wheelchair</span>;
    case 'unknown':
    default:
      return null;
  }
}

function accessibilityDescription(accessibility: YesNoLimitedUnknown) {
  switch (accessibility) {
    case 'yes': return <span>Entrance without steps, all rooms without steps.</span>;
    case 'limited': return <span>Entrance has one step with max. 7 cm / 3 inch height, most rooms are without steps.</span>;
    case 'no': return <span>Entrance has a step or several steps, rooms are not accessible.</span>;
    case 'unknown':
    default:
      return null;
  }
}

function toiletDescription(accessibility: YesNoUnknown) {
  switch (accessibility) {
    case 'yes': return <span><span>Has a wheelchair accessible toilet.</span> <ToiletStatusAccessibleIcon/></span>;
    case 'no': return <span>No wheelchair accessible toilet.</span>;
    case 'unknown':
    default:
      return null;
  }
}

function BasicAccessibility(props) {
  const wheelchairAccessibility = isWheelchairAccessible(props.properties);
  const toiletAccessibility = hasAccessibleToilet(props.properties);
  return (<section className={`basic-accessibility ${props.className}`}>
    <header className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}>{accessibilityName(wheelchairAccessibility)}</header>
    <footer className={`accessibility-toilet accessibility-${toiletAccessibility}`}>{toiletDescription(toiletAccessibility)}</footer>
    <footer>{accessibilityDescription(wheelchairAccessibility)}</footer>
  </section>);
}

const StyledBasicAccessibility = styled(BasicAccessibility)`
  > * {
    margin: 1em 0em;
  }
  > *:last-child {
    margin-bottom: inherit;
  }
  header {
    &.accessibility-wheelchair {
      font-weight: bold;
    }
    &.accessibility-yes {
      color: ${colors.positiveColor};
      svg {
        margin: 0 10px 0 5px;
      }
      polygon#checkmark {
        fill: ${colors.positiveColor};
      }
    }
    &.accessibility-limited {
      color: ${colors.warningColor};
    }
    &.accessibility-no {
      color: ${colors.negativeColor};
    }
  }
  footer {
    &.accessibility-toilet span {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    color: rgba(0, 0, 0, 0.6);
  }
  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export default StyledBasicAccessibility;