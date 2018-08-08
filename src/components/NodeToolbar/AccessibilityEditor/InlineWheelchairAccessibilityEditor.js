// @flow

import { t } from 'ttag';
import * as React from 'react';
import Icon from '../../Icon';
import { shortAccessibilityName } from '../../../lib/Feature';
import type { YesNoLimitedUnknown } from '../../../lib/Feature';
import IconButton from '../../IconButton';
import styled from '../../../../node_modules/styled-components';
import colors from '../../../lib/colors';

type Props = {
  onChange: (newValue: YesNoLimitedUnknown) => void;
  category: ?string;
};

const Row = styled.section`
  display: flex;
  flex-direction: row;
  margin: 1rem 0;

  button {
    flex: 1;

    margin: 0;
    padding: .5rem;
    border: 1px solid ${colors.borderColor};

    font-size: 1rem;
    background-color: transparent;
    transition: background-color 0.1s ease-out;

    .caption {
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
      .caption {
        color: white !important;
      }
    }

    .icon-button {
      padding: 5px 0;
    }
  }

  button.yes {
    .caption {
      color: ${colors.positiveColorDarker};
    }
    &:hover, &:focus {
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
    .caption {
      color: ${colors.warningColorDarker};
    }
    &:hover, &:focus {
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
    .caption {
      color: ${colors.negativeColorDarker};
    }
    &:hover, &:focus {
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
  return <Row aria-label={t`Wheelchair accessibility`}>
    {['yes', 'limited', 'no'].map((value, index) => <button aria-label={shortAccessibilityName(value)} onClick={() => props.onChange(value)} className={value} key={value}>
        <IconButton key={value} caption={shortAccessibilityName(value)} isHorizontal={false}>
          <Icon accessibility={value} category={props.category} size="medium" withArrow shadowed />
        </IconButton>
      </button>)}
  </Row>;
}