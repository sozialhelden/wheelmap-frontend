// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';
import isEqual from 'lodash/isEqual';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { getFilterNameForFilterList } from './FilterModel';

import AllAccessibilitiesIcon from '../icons/accessibility/AllAccessibilities';
import UnknownAccessibilityIcon from '../icons/accessibility/UnknownAccessibility';
import AtLeastPartialAccessibilityIcon from '../icons/accessibility/AtLeastPartialAccessibility';
import FullAccessibilityIcon from '../icons/accessibility/FullAccessibility';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';


const StyledButton = styled.div`
  width: 40px;
  min-height: 40px;
  background-color: white;
  border-radius: 4px;
  outline: none;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 200px;
  right: 10px;
  z-index: 400;
  cursor: pointer;
  &:hover {
    background-color: ${colors.linkBackgroundColor};
  }
  header, footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 40px;
    height: 40px;
  }
  footer {
    position: absolute;
    top: 40px;
    svg {
      margin-top: 4px;
      margin-left: 4px;
    }
  }
  header {
    span {
      width: 22px;
      height: 22px;
      border: 1px solid rgba(0, 0, 0, 0.75);
      border-radius: 11px;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.75);
    }
    svg {
      width: 28px;
    }
  }
`;

type Props = {
  className?: string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  onClick: (() => void),
}

const defaultProps = {
  className: '',
};

class FilterButton extends Component <typeof defaultProps, Props, void> {
  static defaultProps = defaultProps;
  props: Props;

  render() {
    // const accessibility = this.props.accessibilityFilter.map((f, i) => <StyledFilterPoint value={f} index={i} />);
    const toiletFilterHint = null;
    const filterName = getFilterNameForFilterList(this.props.accessibilityFilter);
    let Icon = null;
    switch (filterName) {
      case 'all': Icon = AllAccessibilitiesIcon; break;
      case 'partial': Icon = AtLeastPartialAccessibilityIcon; break;
      case 'full': Icon = FullAccessibilityIcon; break;
      case 'unknown': Icon = UnknownAccessibilityIcon; break;
      default: Icon = null;
    };
    return (<StyledButton
      className={`${this.props.className} leaflet-filter-button`}
      title="Change which places are shown on the map"
      onClick={this.props.onClick}
    >
      <header>
        {Icon ? <Icon /> : <span>?</span>}
      </header>

      {isEqual(this.props.toiletFilter, ['yes']) ? <footer><ToiletStatusAccessibleIcon /></footer> : null}

    </StyledButton>);
  }
}


export default FilterButton;
