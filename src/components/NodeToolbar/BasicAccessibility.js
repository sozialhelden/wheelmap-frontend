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
import { hsl } from 'd3-color';


function AccessibilityName(accessibility: YesNoLimitedUnknown) {
  const description = accessibilityName(accessibility);
  switch (accessibility) {
    case 'yes':
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
    case 'yes': return <span><span>{description}</span> <ToiletStatusAccessibleIcon /></span>;
    case 'no': return <span>{description}</span>;
    case 'unknown':
    default:
      return null;
  }
}


function BasicAccessibility(props) {
  const wheelchairAccessibility = isWheelchairAccessible(props.properties);
  const toiletAccessibility = hasAccessibleToilet(props.properties);
  if (wheelchairAccessibility === 'unknown' && toiletAccessibility === 'unknown') {
    return null;
  }

  return (<section className={`basic-accessibility ${props.className}`}>
    <header className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}>{AccessibilityName(wheelchairAccessibility)}</header>
    <footer className={`accessibility-toilet accessibility-${toiletAccessibility}`}>{ToiletDescription(toiletAccessibility)}</footer>
    <footer><span>{accessibilityDescription(wheelchairAccessibility)}</span></footer>
  </section>);
}

const StyledBasicAccessibility = styled(BasicAccessibility)`
  padding-bottom: 10px;

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
      color: ${hsl(colors.positiveColor).darker(1.2)};
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
      color: ${hsl(colors.negativeColor).darker(0.8)};
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
