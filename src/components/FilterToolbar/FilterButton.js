// @flow

import { t } from '../../lib/i18n';
import * as React from 'react';
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


const StyledButton = styled.button`
  width: 40px;
  min-height: 40px;
  padding: 0;
  background-color: white;
  border-radius: 4px;
  outline: none;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 200px;
  right: 10px;
  z-index: 500;
  cursor: pointer;
  &:hover, &:focus {
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

class FilterButton extends React.Component<Props, void> {
  static defaultProps = defaultProps;
  props: Props;

  focus() {
    this.button.focus();
  }

  render() {
    const filterName = getFilterNameForFilterList(this.props.accessibilityFilter);
    let Icon = null;
    switch (filterName) {
      case 'all': Icon = AllAccessibilitiesIcon; break;
      case 'partial': Icon = AtLeastPartialAccessibilityIcon; break;
      case 'full': Icon = FullAccessibilityIcon; break;
      case 'unknown': Icon = UnknownAccessibilityIcon; break;
      default: Icon = null;
    }

    // translator: Tooltip shown on the filter button
    const filterButtonHint = t`Change which places are shown on the map`;

    return (<StyledButton
      innerRef={button => this.button = button}
      className={`${this.props.className} leaflet-filter-button`}
      title={filterButtonHint}
      onClick={this.props.onClick}
      tabIndex={0}
      aria-hidden="true"
    >
      <header>
        {Icon ? <Icon /> : <span>?</span>}
      </header>

      {isEqual(this.props.toiletFilter, ['yes']) ? <footer><ToiletStatusAccessibleIcon /></footer> : null}

    </StyledButton>);
  }
}


export default FilterButton;
