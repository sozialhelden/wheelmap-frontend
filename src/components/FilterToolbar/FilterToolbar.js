// @flow

import { t } from '../../lib/i18n';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { RadioGroup, Radio } from 'react-radio-group';

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
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { getFiltersForNamedFilter, getFilterNameForFilterList } from './FilterModel';
import type { FilterName } from './FilterModel';

type Props = {
  className: string,
  hidden: boolean,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
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

type CustomRadioProps = {
  currentFilterName: string,
  value: string,
}

type CustomRadioState = {
  isFocused: boolean,
}

class CustomRadio extends React.Component<CustomRadioProps, CustomRadioState> {
  state = {
    isFocused: false
  }

  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    const { currentFilterName, value } = this.props;
    if (currentFilterName === value) {
      this.radioButton.focus();
    }
  }

  onFocus() {
    this.setState({ isFocused: true})
  }

  onBlur() {
    this.setState({ isFocused: false})
  }

  focus() {
    this.radioButton.focus();
  }

  render() {
    const { currentFilterName, value } = this.props;
    const isRadioButtonSelected = currentFilterName === value;
    const RadioButton = isRadioButtonSelected ? RadioButtonSelected : RadioButtonUnselected;
    return (
      <div>
        <Radio
          id={value}
          value={value}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={radioButtonInstance => this.radioButton = findDOMNode(radioButtonInstance)}
          role="radio"
          aria-checked={isRadioButtonSelected}
        />
        <RadioButton className={`radio-button${this.state.isFocused ? ' focus-ring' : ''}`} aria-hidden={true} />
      </div>
    );
  }
}

class FilterToolbar extends React.Component<Props, State> {
  static defaultProps: DefaultProps;
  toolbar: ?React.Element<typeof Toolbar>;

  state = {
    filterName: 'all',
    toiletCheckboxFocused: false,
  };

  constructor(props) {
    super(props);

    this.trapFocus = this.trapFocus.bind(this);
    this.escapeHandler = this.escapeHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeHandler);
  }

  escapeHandler(event) {
    if (event.key === 'Escape') {
      this.props.onCloseClicked();
    }
  }

  trapFocus({nativeEvent}) {
    if (nativeEvent.target === this.toiletCheckbox && nativeEvent.key === 'Tab' && !nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.closeButton.focus();
    }

    if (nativeEvent.target === this.closeButton && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.toiletCheckbox.focus();
    }
  }

  render() {
    const accessibilityFilter = this.props.accessibilityFilter;
    const filterName = accessibilityFilter ? getFilterNameForFilterList(accessibilityFilter) : 'all';
    // const shouldShowToiletFilter = (f) => includes(['partial', 'full'], f);
    const shouldShowToiletFilter = () => true;
    const isToiletFilterEnabled = isEqual(this.props.toiletFilter, ['yes']);

    // translator: Shown at the top of the filter toolbar
    const headerText = t`Which places do you want to see?`;

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
      <Toolbar
        className={this.props.className}
        hidden={this.props.hidden}
        minimalHeight={75}
        isSwipeable={false}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
        role="dialog"
        ariaLabel={t`Accessibility Filter Dialog`}
        ariaModal={true}
      >
        <CloseButton
          closeButtonRef={closeButton => this.closeButton = closeButton}
          onClick={this.props.onCloseClicked}
          onKeyDown={this.trapFocus}
          className="close-icon"
        />
        <header>{headerText}</header>
        <section>
          <RadioGroup
            name="accessibility-filter"
            role="radiogroup"
            selectedValue={filterName}
            onChange={(f) => {
              const filter = {
                status: f === 'all' ? null : getFiltersForNamedFilter(f).join('.'),
                toilet: shouldShowToiletFilter(f) && isToiletFilterEnabled ? 'yes' : null,
              };
              filter.toilet = null;
              this.props.onFilterChanged(filter);
              setTimeout(() => {
                if (this.toolbar) {
                  this.toolbar.onResize();
                  if (this.toolbar) this.toolbar.ensureFullVisibility();
                }
              }, 120);
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
        <section className={shouldShowToiletFilter(filterName) ? '' : 'section-hidden'}>
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
              onKeyDown={this.trapFocus}
            />
            <span className={`icon${ this.state.toiletCheckboxFocused ? ' focus-ring' : ''}`}>
              {isToiletFilterEnabled ? <ToiletStatusAccessibleIcon /> : <ToiletStatusIcon />}
            </span>
            <span className="caption">{toiletFilterCaption}</span>
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

  .radio-button.focus-ring {
    border-radius: 100%;
    box-shadow: 0px 0px 0px 2px #4469E1;
  }
`;

export default StyledFilterToolbar;
