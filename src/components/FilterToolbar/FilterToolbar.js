// @flow

import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import type { AnyReactElement } from 'react-flow-types';

import CloseIcon from '../icons/actions/Close';

import RadioButtonUnselected from '../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../icons/ui-elements/RadioButtonSelected';

import AllAccessibilitiesIcon from '../icons/accessibility/AllAccessibilities';
import UnknownAccessibilityIcon from '../icons/accessibility/UnknownAccessibility';
import AtLeastPartialAccessibilityIcon from '../icons/accessibility/AtLeastPartialAccessibility';
import FullAccessibilityIcon from '../icons/accessibility/FullAccessibility';
import ToiletStatusIcon from '../icons/accessibility/ToiletStatus';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';

import Toolbar from '../Toolbar';
import { setQueryParams } from '../../lib/queryParams';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { getFiltersForNamedFilter, getFilterNameForFilterList } from './FilterModel';
import type { FilterName } from './FilterModel';

type Props = {
  className: string,
  hidden: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  onCloseClicked: (() => void),
};

type DefaultProps = {};

type State = {
  filterName: FilterName,
};


const PositionedCloseLink = styled(CloseIcon)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px;
  padding: 10px;
  cursor: pointer;
`;


class FilterToolbar extends Component<DefaultProps, Props, State> {
  static defaultProps: DefaultProps;
  toolbar: ?AnyReactElement;

  state = {
    filterName: 'all',
  };

  render() {
    const accessibilityFilter = this.props.accessibilityFilter;
    const filterName = accessibilityFilter ? getFilterNameForFilterList(accessibilityFilter) : 'all';
    const shouldShowToiletFilter = (f) => includes(['partial', 'full'], f);
    const isToiletFilterEnabled = isEqual(this.props.toiletFilter, ['yes']);
    function CustomRadio({ value }: { value: string }) {
      const RadioButton = filterName === value ? RadioButtonSelected : RadioButtonUnselected;
      return <RadioButton className="radio-button" />;
    }
    return (
      <Toolbar
        className={this.props.className}
        hidden={this.props.hidden}
        minimalHeight={75}
        isSwipeable={false}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
      >
        <PositionedCloseLink onClick={this.props.onCloseClicked} className="close-icon" />
        <header>Which places do you want to see?</header>
        <section>
          <RadioGroup
            name="accessibility-filter"
            selectedValue={filterName}
            onChange={(f) => {
              setQueryParams({
                status: f === 'all' ? null : getFiltersForNamedFilter(f).join('.'),
                toilet: shouldShowToiletFilter(f) && isToiletFilterEnabled ? 'yes' : null,
              });
              setTimeout(() => {
                if (this.toolbar) {
                  this.toolbar.onResize();
                  if (this.toolbar) this.toolbar.ensureFullVisibility();
                }
              }, 120);
            }}
          >
            <label>
              <Radio value="all" />
              <CustomRadio value="all" />
              <span className="icon"><AllAccessibilitiesIcon /></span>
              <span className="caption">All</span>
            </label>
            <label>
              <Radio value="partial" />
              <CustomRadio value="partial" />
              <span className="icon"><AtLeastPartialAccessibilityIcon /></span>
              <span className="caption">At least partially wheelchair accessible</span>
            </label>
            <label>
              <Radio value="full" />
              <CustomRadio value="full" />
              <span className="icon"><FullAccessibilityIcon /></span>
              <span className="caption">Only fully wheelchair accessible</span>
            </label>
            <label>
              <Radio value="unknown" />
              <CustomRadio value="unknown" />
              <span className="icon"><UnknownAccessibilityIcon /></span>
              <span className="caption">Places that I can contribute to</span>
            </label>
          </RadioGroup>
        </section>
        <section className={shouldShowToiletFilter(filterName) ? '' : 'section-hidden'}>
          <label htmlFor="toilet-filter">
            <input
              onChange={(event) => {
                const value = event.target.checked;
                setQueryParams({ toilet: (value === true) ? 'yes' : null });
              }}
              type="checkbox"
              id="toilet-filter"
              checked={isToiletFilterEnabled}
            />
            <span className="icon">
              {isToiletFilterEnabled ? <ToiletStatusAccessibleIcon /> : <ToiletStatusIcon />}
            </span>
            <span className="caption">Only show places with a wheelchair accessible toilet</span>
          </label>
        </section>
      </Toolbar>
    );
  }
}

const StyledFilterToolbar = styled(FilterToolbar)`
  top: 190px;
  @media (max-width: 768px) {
    top: 0px;
    max-height: calc(100% - 20px);
  }

  left: auto;
  right: 0px;
  padding-bottom: 10px;

  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    padding-right: 20px; /* For close icon */
  }

  section {
    opacity: 1;
    max-height: 300px;
    overflow: hidden;
    transition: opacity 0.1s ease-out, max-height 0.1s ease-out;
    box-sizing: border-box;
    &.section-hidden {
      max-height: 0;
      opacity: 0;
    }
  }

  label {
    display: flex;
    margin: 1em 0;
    align-items: center;
    cursor: pointer;
    input {
      width: 0;
      height: 0;
      opacity: 0;
    }
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
    .radio-button {
      margin-right: 8px;
    }
    .caption {
      flex: 1;
    }
    &:focus {
      background-color: yellow;
    }
  }
`;

export default StyledFilterToolbar;
