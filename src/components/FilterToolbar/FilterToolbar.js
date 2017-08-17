// @flow

import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

import CloseIcon from '../icons/actions/Close';
import Toolbar from '../Toolbar';
import { getQueryParams, setQueryParams } from '../../lib/queryParams';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import type { AnyReactElement } from 'react-flow-types';

type Props = {
  className: string,
  hidden: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  onCloseClicked: (() => void),
};

type DefaultProps = {};

type FilterName = 'all' | 'partial' | 'full' | 'unknown';

type State = {
  filterName: FilterName,
};


const PositionedCloseLink = styled(CloseIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 10px;
  cursor: pointer;
`;

function sortedIsEqual(array1, array2): boolean {
  return isEqual([].concat(array1).sort(), [].concat(array2).sort());
}

function getFiltersForNamedFilter(name: FilterName): YesNoLimitedUnknown[] {
  switch (name) {
    case 'partial': return ['yes', 'limited'];
    case 'full': return ['yes'];
    case 'unknown': return ['unknown'];
    case 'all':
    default: return ['yes', 'limited', 'no', 'unknown'];
  }
}

function getFilterNameForFilterList(list: YesNoLimitedUnknown[]): ?FilterName {
  if (sortedIsEqual(list, ['yes', 'limited'])) return 'partial';
  if (sortedIsEqual(list, ['yes'])) return 'full';
  if (sortedIsEqual(list, ['unknown'])) return 'unknown';
  if (sortedIsEqual(list, ['yes', 'limited', 'no', 'unknown']) || sortedIsEqual(list, [])) return 'all';
  return null;
}

class FilterToolbar extends Component<DefaultProps, Props, State> {
  static defaultProps: DefaultProps;
  toolbar: ?AnyReactElement;

  state = {
    filterName: 'all',
  }

  render() {
    const accessibilityFilter = this.props.accessibilityFilter;
    const filterName = accessibilityFilter ? getFilterNameForFilterList(accessibilityFilter) : 'all';
    const shouldShowToiletFilter = (f) => includes(['partial', 'full'], f);
    const isToiletFilterEnabled = isEqual(this.props.toiletFilter, ['yes']);

    return (
      <Toolbar
        className={this.props.className}
        hidden={this.props.hidden}
        minimalHeight={75}
        isSwipeable={false}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
      >
        <PositionedCloseLink onClick={this.props.onCloseClicked} />
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
                }
              }, 300);
            }}
          >
            <label><Radio value="all" /><span>All</span></label>
            <label><Radio value="partial" /><span>At least partially wheelchair accessible</span></label>
            <label><Radio value="full" /><span>Only fully wheelchair accessible</span></label>
            <label><Radio value="unknown" /><span>Places that I can contribute to</span></label>
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
            <span>Only show places with a wheelchair accessible toilet</span>
          </label>
        </section>
      </Toolbar>
    );
  }
}

const StyledFilterToolbar = styled(FilterToolbar)`
  top: 140px;
  @media (max-width: 768px) {
    top: 0px;
  }

  left: auto;
  right: 0px;
  padding-bottom: 10px;

  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    padding-right: 10px; /* For close icon */
  }

  section {
    opacity: 1;
    max-height: 300px;
    overflow: hidden;
    transition: opacity 0.3s ease-out, max-height 0.3s ease-out;
    box-sizing: border-box;
    &.section-hidden {
      max-height: 0;
      opacity: 0;
    }
  }

  label {
    display: flex;
    margin: 10px;
    align-items: center;
    cursor: pointer;
    input {
      width: 25px;
      height: 20px;
    }
    span {
      flex: 1;
    }
  }
`;

export default StyledFilterToolbar;
