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

  const toiletAccessibilityIsKnown = toiletAccessibility !== 'unknown';
  const description: ?string = props.properties.wheelchair_description;
  const descriptionElement = description ? <footer className="description">“{description}”</footer> : null;

  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return (<summary className={`basic-accessibility ${props.className}`}>
    <header className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}>{AccessibilityName(wheelchairAccessibility)}</header>
    <footer className='accessibility-description'><span>{accessibilityDescription(wheelchairAccessibility)}</span></footer>
    { toiletAccessibilityIsKnown && <footer className={`accessibility-toilet accessibility-${toiletAccessibility}`}>{ToiletDescription(toiletAccessibility)}</footer> }
    { description && descriptionElement }
  </summary>);
}

const StyledBasicAccessibility = styled(BasicAccessibility)`
  margin: 1rem -0.5rem;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;

  &:before {
    display: block;
    position: absolute;
    content: " ";
    top: -8px;
    left: 1em;
    width: 12px;
    height: 8px;
    background: url(../NoseDetailsContainer.svg) no-repeat; /* TODO: decide on outline vs. color & add nose */
  }
  
  > * {
    margin: 1rem 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  header {
    :first-child {
      margin: 0;
    }
    &:not(:first-child) {
      margin: 0.25rem 0 0 0;
    }
    &.accessibility-wheelchair {
      font-weight: bold;
    }
    &.accessibility-yes {
      color: ${colors.positiveColorDarker};
    }
    &.accessibility-limited {
      color: ${colors.warningColorDarker};
    }
    &.accessibility-no {
      color: ${colors.negativeColorDarker};
    }
  }

  footer {
    &.accessibility-description {
      margin-top: 0.25rem;
    }
    &.accessibility-toilet span {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      align-items: center;

      svg {
        margin-right: 0.5rem;
      }

      span {
        font-weight: bold;
        color: ${colors.positiveColorDarker};
      }
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
