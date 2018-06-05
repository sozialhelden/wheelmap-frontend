// @flow

import * as React from 'react';
import { hsl } from 'd3-color';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import { interpolateLab } from 'd3-interpolate';

import Icon from '../Icon';
import colors from '../../lib/colors';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import ToiletStatusAccessible from '../icons/accessibility/ToiletStatusAccessible';
import { isFiltered } from '../../lib/Feature';


type Props = {
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  category?: ?string,
  isMainCategory?: boolean,
  className: string,
}

const evenMoreTransparentLinkColor = hsl(colors.linkBackgroundColorTransparent);
evenMoreTransparentLinkColor.opacity *= 0.5;

const halfTonedDownSelectedColor = interpolateLab(colors.tonedDownSelectedColor, colors.selectedColor)(0.5);


function CombinedIcon(props: Props) {
  if (!props.accessibilityFilter) return null;
  const accessibilities = isFiltered(props.accessibilityFilter) ? props.accessibilityFilter : [null];
  return <div aria-hidden className={`accessibilities ${props.className}`}>
    {accessibilities
      .map(accessibility => <Icon
        key={accessibility}
        accessibility={accessibility}
        category={props.category}
        isMainCategory={props.isMainCategory}
        size="medium"
      />)}
      {isEqual(props.toiletFilter, ['yes']) ? <figure className="toilet-icon"><ToiletStatusAccessible /></figure> : null }
  </div>;
}


const StyledCombinedIcon = styled(CombinedIcon)`
  display: flex;
  flex-direction: row;
  width: 70px;
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
    margin-left: -31px;
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
    margin-left: -22px;
  }

  figure.add-stroke svg.background {
    circle, path {
      stroke-width: 1.2px;
      stroke: white;
    }
  }
`;

export default StyledCombinedIcon;
