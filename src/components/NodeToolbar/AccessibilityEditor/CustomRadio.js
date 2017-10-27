// @flow

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Radio } from 'react-radio-group';
import RadioButtonUnselected from '../../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../../icons/ui-elements/RadioButtonSelected';


type Props = {
  currentValue: string,
  shownValue: string,
  description: ?string,
  caption: ?string,
};

type State = {
  isFocused: boolean
}

export default class CustomRadio extends React.Component<Props, State> {
  state = {
    isFocused: false
  }

  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
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
          ref={radioButtonInstance => this.radioButton = findDOMNode(radioButtonInstance)}
          aria-label={this.props.caption}
          aria-describedby={this.props.description}
        />
        <RadioButton className={`radio-button${this.state.isFocused ? ' focus-ring' : ''}`} aria-hidden={true}/>
        <span className="caption" aria-hidden={true}>{this.props.caption}</span>
      </header>
      {this.props.description ? <footer aria-hidden={true}>{this.props.description}</footer> : null}
    </label>);
  }
}
