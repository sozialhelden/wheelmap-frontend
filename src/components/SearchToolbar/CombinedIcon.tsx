import * as React from 'react';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';

import CategoryIcon from '../Icon';
import { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import ToiletStatusAccessible from '../icons/accessibility/ToiletStatusAccessible';
import { isAccessibilityFiltered } from '../../lib/Feature';

type Props = {
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  category?: string | null,
  isMainCategory?: boolean,
  className?: string,
};

function CombinedIcon(props: Props) {
  if (!props.accessibilityFilter) return null;

  const accessibilities = isAccessibilityFiltered(props.accessibilityFilter)
    ? props.accessibilityFilter
    : [null];

  return (
    <div aria-hidden className={props.className}>
      {accessibilities.map(accessibility => (
        <CategoryIcon
          key={accessibility}
          accessibility={accessibility}
          category={props.category}
          isMainCategory={props.isMainCategory}
          size="medium"
        />
      ))}
      {isEqual(props.toiletFilter, ['yes']) ? (
        <ToiletIcon>
          <ToiletStatusAccessible />
        </ToiletIcon>
      ) : null}
    </div>
  );
}

const ToiletIcon = styled.figure``;

export default styled(CombinedIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  figure {
    line-height: 0;
  }

  figure + figure {
    margin-left: -32px;
  }

  figure:nth-child(1) {
    z-index: 2;
  }

  figure:nth-child(2) {
    z-index: 1;
    transform: scale(0.95, 0.95);

    .icon {
      display: none;
    }
  }

  figure:nth-child(3) {
    transform: scale(0.9, 0.9);
  }

  figure${ToiletIcon} {
    z-index: 3;
    margin: 0 0 0 -13px;

    &:nth-child(3) {
      margin-left: -18px;
    }
  }

  figure.add-stroke svg.background {
    circle,
    path {
      stroke-width: 1.2px;
      stroke: white;
    }
  }
`;
