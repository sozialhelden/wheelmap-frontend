import * as React from 'react';
import { Radio } from 'react-radio-group';

import RadioButtonUnselected from '../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../icons/ui-elements/RadioButtonSelected';

type FilterName = any;

type CustomRadioProps = {
  currentFilterName: FilterName,
  value: string,
};

type CustomRadioState = {
  isFocused: boolean,
};

interface Focusable {
  focus(): void;
}

export default class CustomRadio extends React.Component<CustomRadioProps, CustomRadioState> {
  state = {
    isFocused: false,
  };

  radioButton = React.createRef<React.Component<any> & Focusable>();

  componentDidMount() {
    const { currentFilterName, value } = this.props;
    if (currentFilterName === value) {
      this.radioButton.current?.focus();
    }
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  };

  onBlur = () => {
    this.setState({ isFocused: false });
  };

  focus() {
    this.radioButton.current?.focus();
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
          ref={this.radioButton}
          aria-checked={isRadioButtonSelected}
        />
        <RadioButton
          className={`radio-button${this.state.isFocused ? ' focus-visible' : ''}`}
          aria-hidden
        />
      </div>
    );
  }
}
