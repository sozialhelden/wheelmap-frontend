// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled, { css } from 'styled-components';

import CombinedIcon from './CombinedIcon';
import colors from '../../lib/colors';
import IconButton, { Circle, Caption } from '../IconButton';
import Button from '../Button';
import CloseIcon from '../icons/actions/Close';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { isAccessibilityFiltered } from '../../lib/Feature';

type Props = {
  name: string,
  category: string,
  showCloseButton: boolean,
  hasCircle?: boolean,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  onClick: (category: string) => void,
  onFocus?: (event: UIEvent) => void,
  className?: string,
};

function CategoryButton(props: Props) {
  const { category, accessibilityFilter, toiletFilter, showCloseButton, className } = props;

  let shownAccessibilities = accessibilityFilter;
  if (showCloseButton || !isAccessibilityFiltered(accessibilityFilter)) {
    shownAccessibilities = [];
  }

  const icon = (
    <CombinedIcon
      accessibilityFilter={shownAccessibilities}
      toiletFilter={toiletFilter}
      category={category || 'undefined'}
      isMainCategory
      size="medium"
      ariaHidden={true}
    />
  );

  return (
    <Button
      onClick={() => props.onClick(category)}
      className={className}
      onFocus={props.onFocus}
      aria-label={showCloseButton ? t`Remove ${props.name} Filter` : props.name}
    >
      <IconButton isHorizontal={showCloseButton} caption={props.name} hasCircle={props.hasCircle}>
        {icon}
      </IconButton>
      {showCloseButton && <CloseIcon />}
    </Button>
  );
}

export default styled(CategoryButton)`
  display: flex;
  align-items: center;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${Circle} {
    background-color: ${colors.tonedDownSelectedColor};
    margin: 2.5px;

    svg.icon {
      g,
      path,
      circle,
      rect {
        fill: white;
      }
    }
  }

  svg.icon {
    width: 21px;
    height: 21px;
  }

  &.active {
    background-color: ${colors.coldBackgroundColor};

    ${Circle} {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};

    ${Circle} {
      background-color: ${colors.halfTonedDownSelectedColor};
    }

    &.active {
      ${Circle} {
        background-color: ${colors.tonedDownSelectedColor};
      }
    }
  }

  ${props =>
    props.showCloseButton
      ? css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 1em 0 1.3em;
          min-height: 3rem;

          ${IconButton} {
            flex: 1;
            flex-direction: row;

            ${CombinedIcon} {
              width: 70px;
            }

            ${Caption} {
              color: ${colors.darkSelectedColor};
            }
          }
        `
      : css`
          flex-direction: column;

          ${IconButton} {
            flex-direction: column;

            ${CombinedIcon} {
              justify-content: center;
            }

            ${Caption} {
              font-size: 0.8em;
              margin-top: 0.5em;
              color: ${colors.darkSelectedColor};
            }
          }
        `};
`;
