// @flow

import * as React from 'react';
import { Radio } from 'react-radio-group';
import RadioButtonUnselected from '../../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../../icons/ui-elements/RadioButtonSelected';


type Props = {
  currentValue?: ?string,
  shownValue: string,
  description: ?string,
  caption: ?string,
  children?: ?React.Node,
};

type State = {
  isFocused: boolean
}

export default class CustomRadio extends React.Component<Props, State> {
  state = {
    isFocused: false
  }

  radioButton: ?Radio;

  onFocus = () => {
    this.setState({ isFocused: true })
  };

  onBlur = () => {
    this.setState({ isFocused: false })
  };

  focus() {
    if (this.radioButton) {
      this.radioButton.focus();
    }
  }

  render() {
    const shownValue = this.props.shownValue;
    const isSelected = (this.props.currentValue === shownValue);
    const RadioButton = isSelected ? RadioButtonSelected : RadioButtonUnselected;
    const id = `accessibility-${shownValue}`;

    return (<label className={`${shownValue} ${isSelected ? 'is-selected' : ''}`} htmlFor={id}>
      <header>
        <Radio
          value={shownValue}
          id={id}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={radioButtonInstance => this.radioButton = radioButtonInstance}
          aria-label={this.props.caption}
        />
        <RadioButton className={`radio-button${this.state.isFocused ? ' focus-ring' : ''}`} aria-hidden={true}/>
        {this.props.children}
        <span className="caption" aria-hidden={true}>{this.props.caption}</span>
      </header>
      {this.props.description ? <footer>{this.props.description}</footer> : null}
    </label>);
  }
}
