// @flow

import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import styled from 'styled-components';
import { accessibilityDescription, accessibilityName } from '../../lib/Feature';
import type {
  YesNoLimitedUnknown,
} from '../../lib/Feature';
import RadioButtonUnselected from '../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../icons/ui-elements/RadioButtonSelected';
import colors from '../../lib/colors';


type Props = {
  wheelchairAccessibility: YesNoLimitedUnknown,
  className: string,
};


type State = {
  wheelchairAccessibility: YesNoLimitedUnknown,
};


class AccessibilityEditor extends Component<void, Props, State> {
  props: Props;
  state = {
    wheelchairAccessibility: 'unknown',
  };

  componentWillReceiveProps(props) {
    this.setState({ wheelchairAccessibility: props.wheelchairAccessibility });
  }

  render() {
    const accessibility = this.state.wheelchairAccessibility;

    function CustomRadio(props: { value: YesNoLimitedUnknown }) {
      const value = props.value;
      const isSelected = (accessibility === value);
      const RadioButton = isSelected ? RadioButtonSelected : RadioButtonUnselected;
      return (<label>
        <header>
          <Radio value={value} />
          <RadioButton className="radio-button" />
          <span className={`caption ${value}`}>{accessibilityName(value)}</span>
        </header>
        <footer>
          {accessibilityDescription(value)}
        </footer>
      </label>);
    }

    const classList = [
      accessibility,
      this.props.className,
    ].filter(Boolean);

    return (<RadioGroup
      name="accessibility"
      selectedValue={accessibility}
      onChange={(newValue) => { this.setState({ wheelchairAccessibility: newValue }); }}
      className={classList.join(' ')}
    >
      {['yes', 'limited', 'no'].map(value => <CustomRadio key={value} value={value} />)}
    </RadioGroup>);
  }
}


const StyledAccessibilityEditor = styled(AccessibilityEditor)`
  display: flex;
  flex-direction: column;

  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
  }

  &.yes label > header span.yes {
    color: ${colors.positiveColor};
  }
  &.limited label > header span.limited {
    color: ${colors.warningColor};
  }
  &.no label > header span.no {
    color: ${colors.negativeColor};
  }

  label {
    header {
      display: flex;
      margin: 1em 0;
      align-items: center;
      font-weight: bold;
    }
    footer {
      opacity: 0.6;
    }
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

export default StyledAccessibilityEditor;
