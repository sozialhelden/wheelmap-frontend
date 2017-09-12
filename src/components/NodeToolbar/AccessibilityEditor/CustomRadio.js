// @flow

import * as React from 'react';
import { Radio } from 'react-radio-group';
import RadioButtonUnselected from '../../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../../icons/ui-elements/RadioButtonSelected';


type Props = {
  currentValue: string,
  shownValue: string,
  description: ?string,
  caption: ?string,
};


export default function CustomRadio(props: Props) {
  const shownValue = props.shownValue;
  const isSelected = (props.currentValue === shownValue);
  const RadioButton = isSelected ? RadioButtonSelected : RadioButtonUnselected;
  const id = `accessibility-${shownValue}`;
  return (<label className={`${shownValue} ${isSelected ? 'is-selected' : ''}`} htmlFor={id}>
    <header>
      <Radio value={shownValue} id={id} />
      <RadioButton className="radio-button" />
      <span className="caption">{props.caption}</span>
    </header>
    {props.description ? <footer>{props.description}</footer> : null}
  </label>);
}
