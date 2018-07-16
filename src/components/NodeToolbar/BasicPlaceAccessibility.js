// @flow

import * as React from 'react';
import styled from 'styled-components';
import {
  isWheelchairAccessible,
  hasAccessibleToilet,
  accessibilityName,
  accessibilityDescription,
  toiletDescription,
  isWheelmapFeature,
} from '../../lib/Feature';
import type { NodeProperties } from '../../lib/Feature';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';
import PenIcon from '../icons/actions/PenIcon';
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


type Props = {
  properties: NodeProperties,
  onClickWheelchairAccessibility: (() => void),
  onClickToiletAccessibility: (() => void),
  className: string,
  children: React.Element<*>,
};


function BasicAccessibility(props: Props) {
  const wheelchairAccessibility = isWheelchairAccessible(props.properties);
  const toiletAccessibility = hasAccessibleToilet(props.properties);
  if (wheelchairAccessibility === 'unknown' && toiletAccessibility === 'unknown') {
    return null;
  }

  const toiletAccessibilityIsKnown = toiletAccessibility !== 'unknown';
  let description: ?string = null;
  if (typeof props.properties.wheelchair_description === 'string') {
    description = props.properties.wheelchair_description;
  }
  const descriptionElement = description ? <footer className="description">“{description}”</footer> : null;
  const isEnabled = !isWheelmapFeature(props);

  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return (<summary className={`basic-accessibility ${props.className}`}>
    <button
      className={`accessibility-wheelchair accessibility-${wheelchairAccessibility}`}
      onClick={props.onClickWheelchairAccessibility}
    >
      <header>
        <span>{AccessibilityName(wheelchairAccessibility)}</span>
        {isEnabled && <PenIcon className="pen-icon" />}
      </header>

      <footer className='accessibility-description'>
        {accessibilityDescription(wheelchairAccessibility)}
      </footer>
    </button>

    {toiletAccessibilityIsKnown &&
      <button
        className={`accessibility-toilet accessibility-${toiletAccessibility}`}
        onClick={props.onClickToiletAccessibility}
      >
        <header>
          {ToiletDescription(toiletAccessibility)}
          {isEnabled && <PenIcon className="pen-icon" />}
        </header>
      </button>}

    { description && descriptionElement }
    { props.children }
  </summary>);
}


const StyledBasicAccessibility = styled(BasicAccessibility)`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 1rem -0.5rem;
  padding: 10px;
  border: 1px solid ${colors.borderColor};
  border-radius: 4px;
  overflow: hidden;

  > button {
    margin: -10px;
    padding: 10px;
    border: none;
    outline: none;
    appearance: none;
    font-size: 1rem;
    text-align: inherit;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      &.accessibility-yes {
        background-color: ${colors.positiveBackgroundColorTransparent};
      }
      &.accessibility-limited {
        background-color: ${colors.warningBackgroundColorTransparent};
      }
      &.accessibility-no {
        background-color: ${colors.negativeBackgroundColorTransparent};
      }
    }
  }

  > button + button {
    margin-top: calc(-5px + 1rem);
  }

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
  }

  .accessibility-wheelchair, .accessibility-toilet {
    header {
      font-weight: bold;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .accessibility-yes {
    color: ${colors.positiveColorDarker};
    .pen-icon path {
      fill: ${colors.positiveColorDarker};
      stroke: ${colors.positiveColorDarker};
    }
  }
  .accessibility-limited {
    color: ${colors.warningColorDarker};
    .pen-icon path {
      fill: ${colors.warningColorDarker};
      stroke: ${colors.warningColorDarker};
    }
  }
  .accessibility-no {
    color: ${colors.negativeColorDarker};
    .pen-icon path {
      fill: ${colors.negativeColorDarker};
      stroke: ${colors.negativeColorDarker};
    }
  }

  .accessibility-description {
    margin: 0.25rem 0;
    color: rgba(0, 0, 0, 0.6);
  }

  .accessibility-toilet span {
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

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export default StyledBasicAccessibility;
