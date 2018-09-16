// @flow

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Radio } from 'react-radio-group';

import RadioButtonUnselected from '../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../icons/ui-elements/RadioButtonSelected';
import type { FilterName } from './AccessibilityFilterModel';

type CustomRadioProps = {
  currentFilterName: FilterName,
  value: string,
};

type CustomRadioState = {
  isFocused: boolean,
};

export default class CustomRadio extends React.Component<CustomRadioProps, CustomRadioState> {
  state = {
    isFocused: false,
  };

  radioButton: Radio;

  componentDidMount() {
    const { currentFilterName, value } = this.props;
    if (currentFilterName === value) {
      this.radioButton.focus();
    }
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  };

  onBlur = () => {
    this.setState({ isFocused: false });
  };

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
          ref={radioButtonInstance => (this.radioButton = findDOMNode(radioButtonInstance))}
          role="radio"
          aria-checked={isRadioButtonSelected}
        />
        <RadioButton
          className={`radio-button${this.state.isFocused ? ' focus-visible' : ''}`}
          aria-hidden={true}
        />
      </div>
    );
  }
}
