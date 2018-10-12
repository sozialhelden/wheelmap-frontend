// @flow

import * as React from 'react';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';

import Icon from '../Icon';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import ToiletStatusAccessible from '../icons/accessibility/ToiletStatusAccessible';
import { isAccessibilityFiltered } from '../../lib/Feature';

type Props = {
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  category?: ?string,
  isMainCategory?: boolean,
  className: string,
};

function CombinedIcon(props: Props) {
  if (!props.accessibilityFilter) return null;
  const accessibilities = isAccessibilityFiltered(props.accessibilityFilter)
    ? props.accessibilityFilter
    : [null];
  return (
    <div aria-hidden className={`accessibilities ${props.className}`}>
      {accessibilities.map(accessibility => (
        <Icon
          key={accessibility}
          accessibility={accessibility}
          category={props.category}
          isMainCategory={props.isMainCategory}
          size="medium"
        />
      ))}
      {isEqual(props.toiletFilter, ['yes']) ? (
        <figure className="toilet-icon">
          <ToiletStatusAccessible />
        </figure>
      ) : null}
    </div>
  );
}

const StyledCombinedIcon = styled(CombinedIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button {
    flex: 1;
    .caption {
      margin-left: 1em;
      flex: 1;
    }
  }

  figure {
    line-height: 0;
  }

  figure + figure {
    margin-left: -36px;
  }

  figure:nth-child(1) {
    z-index: 2;
  }

  figure:nth-child(2) {
    z-index: 1;
    transform: scale(0.95, 0.95);
  }

  figure:nth-child(3) {
    transform: scale(0.9, 0.9);
  }

  figure.toilet-icon {
    z-index: 3;
    margin: 0 0 0 -13px;
  }

  figure.add-stroke svg.background {
    circle,
    path {
      stroke-width: 1.2px;
      stroke: white;
    }
  }
`;

export default StyledCombinedIcon;
