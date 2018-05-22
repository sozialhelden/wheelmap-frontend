// @flow

import { t } from 'c-3po';
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

import MapButton from '../MapButton';


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

    return (<MapButton
      innerRef={button => this.button = button}
      className={`${this.props.className} leaflet-filter-button`}
      title={filterButtonHint}
      onClick={this.props.onClick}
      tabIndex={0}
    >
      <header>
        {Icon ? <Icon /> : <span>?</span>}
      </header>

      {isEqual(this.props.toiletFilter, ['yes']) ? <footer><ToiletStatusAccessibleIcon /></footer> : null}

    </MapButton>);
  }
}


export default FilterButton;
