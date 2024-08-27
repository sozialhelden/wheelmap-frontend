// Nested custom component is not recognized but rule is fullfilled.
/* eslint-disable jsx-a11y/label-has-for */

import * as React from 'react'
import { Radio } from 'react-radio-group'
import RadioButtonUnselected from '../../icons/ui-elements/RadioButtonUnselected'
import RadioButtonSelected from '../../icons/ui-elements/RadioButtonSelected'

interface Focusable {
  focus(): void
}

type Props = {
  currentValue?: string | null,
  shownValue?: string | null,
  description: string | null,
  caption: string | null,
  children?: React.ReactNode | null,
  disabled?: boolean,
};

type State = {
  isFocused: boolean,
};

export default class CustomRadio extends React.Component<Props, State> {
  state = {
    isFocused: false,
  }

  radioButton = React.createRef<React.Component<any> & Focusable>()

  onFocus = () => {
    this.setState({ isFocused: true })
  }

  onBlur = () => {
    this.setState({ isFocused: false })
  }

  focus() {
    this.radioButton.current?.focus()
  }

  render() {
    const shownValue = this.props.shownValue || ''
    const isDisabled = this.props.disabled
    const isSelected = this.props.currentValue === shownValue
    const RadioButton = isSelected ? RadioButtonSelected : RadioButtonUnselected
    const id = `accessibility-${shownValue}`

    return (
      <label
        className={`${shownValue} ${isSelected ? 'is-selected' : ''} ${
          isDisabled ? 'is-disabled' : ''
        }`}
        htmlFor={id}
      >
        <header>
          <Radio
            value={shownValue}
            id={id}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={isDisabled}
            ref={this.radioButton}
            aria-label={this.props.caption}
          />
          <RadioButton
            className={`radio-button${this.state.isFocused ? ' focus-visible' : ''}`}
            disabled={isDisabled}
            aria-hidden
          />
          {this.props.children}
          <span className="caption" aria-hidden>
            {this.props.caption}
          </span>
        </header>
        {this.props.description ? <footer>{this.props.description}</footer> : null}
      </label>
    )
  }
}
