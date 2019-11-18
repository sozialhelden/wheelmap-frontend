import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import Icon from '../../Icon';
import { shortAccessibilityName } from '../../../lib/Feature';
import { YesNoLimitedUnknown } from '../../../lib/Feature';
import IconButton, { Caption } from '../../IconButton';
import colors from '../../../lib/colors';

type Props = {
  onChange: (newValue: YesNoLimitedUnknown) => void,
  category: string | null
};

const Row = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 1rem 0;

  button {
    flex: 1;

    margin: 0;
    padding: 0.5rem;
    border: 1px solid ${colors.borderColor};

    font-size: 1rem;
    background-color: transparent;
    transition: background-color 0.1s ease-out;

    ${Caption} {
      font-weight: 500;
      margin-top: 0.5rem;
    }

    &:first-child {
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }

    &:last-child {
      border-top-right-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
    }

    & + button {
      border-left: none;
    }

    figure {
      transform: scale3d(1, 1, 1);
      transition: transform 0.1s ease-out;
    }

    &:hover {
      figure {
        transform: scale3d(1.1, 1.1, 1);
      }
    }
    &:active {
      box-shadow: none !important;
      ${Caption} {
        color: white !important;
      }
    }

    .icon-button {
      padding: 5px 0;
    }
  }

  button.yes {
    ${Caption} {
      color: ${colors.positiveColorDarker};
    }
    &:hover,
    &:focus {
      box-shadow: 0 0 1px ${colors.positiveColor};
    }
    &:hover {
      background-color: ${colors.positiveBackgroundColorTransparent};
    }
    &:active {
      background-color: ${colors.positiveColor};
    }
  }
  button.limited {
    ${Caption} {
      color: ${colors.warningColorDarker};
    }
    &:hover,
    &:focus {
      box-shadow: 0 0 1px ${colors.warningColor};
    }
    &:hover {
      background-color: ${colors.warningBackgroundColorTransparent};
    }
    &:active {
      background-color: ${colors.warningColor};
    }
  }
  button.no {
    ${Caption} {
      color: ${colors.negativeColorDarker};
    }
    &:hover,
    &:focus {
      box-shadow: 0 0 1px ${colors.negativeColor};
    }
    &:hover {
      background-color: ${colors.negativeBackgroundColorTransparent};
    }
    &:active {
      background-color: ${colors.negativeColor};
    }
  }
`;

export default function InlineWheelchairAccessibilityEditor(props: Props) {
  // translator: Screen reader description for the accessibility choice buttons for gray places
  return (
    <Row aria-label={t`Wheelchair accessibility`}>
      {['yes', 'limited', 'no'].map((value: YesNoLimitedUnknown) => (
        <button
          aria-label={shortAccessibilityName(value)}
          onClick={() => props.onChange(value)}
          className={value}
          key={value}
        >
          <IconButton key={value} caption={shortAccessibilityName(value)} isHorizontal={false}>
            <Icon
              accessibility={value}
              category={props.category}
              size="medium"
              withArrow
              shadowed
            />
          </IconButton>
        </button>
      ))}
    </Row>
  );
}
