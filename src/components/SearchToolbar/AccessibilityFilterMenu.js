// @flow

import { t } from 'c-3po';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import includes from 'lodash/includes';
import { RadioGroup } from 'react-radio-group';

import CloseIcon from '../icons/actions/Close';

import AllAccessibilitiesIcon from '../icons/accessibility/AllAccessibilities';
import UnknownAccessibilityIcon from '../icons/accessibility/UnknownAccessibility';
import AtLeastPartialAccessibilityIcon from '../icons/accessibility/AtLeastPartialAccessibility';
import FullAccessibilityIcon from '../icons/accessibility/FullAccessibility';
import ToiletStatusIcon from '../icons/accessibility/ToiletStatus';
import ToiletStatusAccessibleIcon from '../icons/accessibility/ToiletStatusAccessible';

import Toolbar from '../Toolbar';
import CustomRadio from './CustomRadio';
import { getFiltersForNamedFilter, getFilterNameForFilterList } from './AccessibilityFilterModel';
import type { FilterName, PlaceFilter } from './AccessibilityFilterModel';


type Props = PlaceFilter & {
  className: string,
  hidden: boolean,
  onCloseClicked: (() => void),
  onFilterChanged: ((filter: PlaceFilter) => void),
};

type DefaultProps = {};

type State = {
  filterName: FilterName,
  toiletCheckboxFocused: boolean,
};

const PositionedCloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px;
  padding: 10px;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
`

const CloseButton = ({onClick, onKeyDown, closeButtonRef, ...restProps}) =>
  <PositionedCloseButton innerRef={closeButtonRef} onClick={onClick} onKeyDown={onKeyDown} aria-label={t`Close Dialog`}>
    <CloseIcon {...restProps} />
  </PositionedCloseButton>

class AccessibilityFilterMenu extends React.Component<Props, State> {
  static defaultProps: DefaultProps;
  toolbar: ?React.ElementRef<typeof Toolbar>;
  toiletCheckbox: ?React.ElementRef<'input'>;
  closeButton: ?React.ElementRef<typeof CloseButton>;

  state = {
    filterName: 'all',
    toiletCheckboxFocused: false,
  };

  render() {
    const accessibilityFilter = this.props.accessibilityFilter;
    const filterName = accessibilityFilter ? getFilterNameForFilterList(accessibilityFilter) : 'all';
    const isToiletFilterEnabled = isEqual(this.props.toiletFilter, ['yes']);


    // translator: Radio button caption on the filter toolbar. Answer to the question which places you want to see, plural
    const allCaption = t`All`;

    // translator: Radio button caption on the filter toolbar. Answer to the question which places you want to see
    const atLeastPartialCaption = t`At least partially wheelchair accessible`;

    // translator: Radio button caption on the filter toolbar. Answer to the question which places you want to see
    const unknownCaption = t`Places that I can contribute to`;

    // translator: Radio button caption on the filter toolbar. Answer to the question which places you want to see
    const fullyCaption = t`Only fully wheelchair accessible`;

    // translator: Checkbox caption on the filter toolbar. If the checkbox is clicked, only places with a wheelchair accessible toilet are shown.
    const toiletFilterCaption = t`Only show places with a wheelchair accessible toilet`;

    return (
      <section
        className={this.props.className}
        aria-label={t`Accessibility Filter Dialog`}
      >
        <section>
          <RadioGroup
            name="accessibility-filter"
            role="radiogroup"
            aria-label={t`Wheelchair Accessibility Filter`}
            selectedValue={filterName}
            onChange={(f) => {
              const filter = {
                status: f === 'all' ? null : getFiltersForNamedFilter(f).join('.'),
                toilet: isToiletFilterEnabled ? 'yes' : null,
              };
              filter.toilet = null;
              this.props.onFilterChanged(filter);
            }}
          >
            <label htmlFor="all">
              <CustomRadio currentFilterName={filterName} value="all" />
              <span className="icon" aria-hidden={true}><AllAccessibilitiesIcon /></span>
              <span className="caption">{allCaption}</span>
            </label>
            <label htmlFor="partial">
              <CustomRadio currentFilterName={filterName} value="partial" />
              <span className="icon" aria-hidden={true}><AtLeastPartialAccessibilityIcon /></span>
              <span className="caption">{atLeastPartialCaption}</span>
            </label>
            <label htmlFor="full">
              <CustomRadio currentFilterName={filterName} value="full" />
              <span className="icon" aria-hidden={true}><FullAccessibilityIcon /></span>
              <span className="caption">{fullyCaption}</span>
            </label>
            <label htmlFor="unknown">
              <CustomRadio currentFilterName={filterName} value="unknown" />
              <span className="icon" aria-hidden={true}><UnknownAccessibilityIcon /></span>
              <span className="caption">{unknownCaption}</span>
            </label>
          </RadioGroup>
        </section>
        <section>
          <label htmlFor="toilet-filter">
            <input
              ref={toiletCheckbox => this.toiletCheckbox = toiletCheckbox }
              onChange={(event) => {
                const value = event.target.checked;
                const filter = { toilet: (value === true) ? 'yes' : null };
                if (value && includes(['all', 'unknown'], filterName)) {
                  filter.status = 'yes.limited';
                }
                this.props.onFilterChanged(filter);
              }}
              type="checkbox"
              id="toilet-filter"
              checked={isToiletFilterEnabled}
              onFocus={() => this.setState({toiletCheckboxFocused: true})}
              onBlur={() => this.setState({toiletCheckboxFocused: false})}
            />
            <span className={`icon${ this.state.toiletCheckboxFocused ? ' focus-ring' : ''}`}>
              {isToiletFilterEnabled ? <ToiletStatusAccessibleIcon /> : <ToiletStatusIcon />}
            </span>
            <span className="caption">{toiletFilterCaption}</span>
          </label>
        </section>
      </section>
    );
  }
}

const StyledAccessibilityFilterMenu = styled(AccessibilityFilterMenu)`
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
      margin: 8px;
    }
    .caption {
      flex: 1;
    }
    &:focus {
      background-color: yellow;
    }
  }

  .radio-button.focus-ring {
    border-radius: 100%;
    box-shadow: 0px 0px 0px 2px #4469E1;
  }
`;

export default StyledAccessibilityFilterMenu;
