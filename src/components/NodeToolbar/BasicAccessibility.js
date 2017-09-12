// @flow

import * as React from 'react';
import styled from 'styled-components';
import {
  isWheelchairAccessible,
  hasAccessibleToilet,
  accessibilityName,
  accessibilityDescription,
  toiletDescription,
} from '../../lib/Feature';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';
import colors from '../../lib/colors';


const CheckmarkIcon = () => (<svg width="16px" height="14px" viewBox="0 0 16 14" version="1.1" className="checkmark-icon">
  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <polygon id="checkmark" fill="#000000" points="4.51565378 13.174954 0 8.67495396 1.76887661 7 4.51565378 9.73112339 14.2311234 0 16 1.67495396 6.23756906 11.5313076" />
  </g>
</svg>);


function AccessibilityName(accessibility: YesNoLimitedUnknown) {
  const description = accessibilityName(accessibility);
  switch (accessibility) {
    case 'yes': return <span><span>{description}</span> <CheckmarkIcon /></span>;
    case 'limited':
    case 'no': return <span>{description}</span>;
    case 'unknown':
    default:
      return null;
  }
}

function ToiletDescription(accessibility: YesNoUnknown) {
  const description = toiletDescription(accessibility);
  switch (accessibility) {
    case 'yes': return <span><span>{description}</span> <ToiletStatusAccessibleIcon/></span>;
    case 'no': return <span>{description}</span>;
    case 'unknown':
    default:
      return null;
  }
}


function BasicAccessibility(props) {
  const wheelchairAccessibility = isWheelchairAccessible(props.properties);
  const toiletAccessibility = hasAccessibleToilet(props.properties);
  return (<section className={`basic-accessibility ${props.className}`}>
    <header className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}>{AccessibilityName(wheelchairAccessibility)}</header>
    <footer className={`accessibility-toilet accessibility-${toiletAccessibility}`}>{ToiletDescription(toiletAccessibility)}</footer>
    <footer><span>{accessibilityDescription(wheelchairAccessibility)}</span></footer>
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