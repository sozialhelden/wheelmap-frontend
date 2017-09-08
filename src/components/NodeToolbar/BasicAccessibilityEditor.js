// @flow

import get from 'lodash/get';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

import { accessibilityDescription, accessibilityName } from '../../lib/Feature';
import RadioButtonUnselected from '../icons/ui-elements/RadioButtonUnselected';
import RadioButtonSelected from '../icons/ui-elements/RadioButtonSelected';
import type { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import colors from '../../lib/colors';


type Props = {
  feature: Feature,
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

  wheelchairAccessibility(): ?YesNoLimitedUnknown {
    if (!this.props.feature || !this.props.feature.properties || !this.props.feature.properties.wheelchair) {
      return null;
    }
    return this.props.feature.properties.wheelchair;
  }

  componentWillReceiveProps(props) {
    const wheelchairAccessibility = this.wheelchairAccessibility(props);
    if (wheelchairAccessibility) {
      this.setState({ wheelchairAccessibility });
    }
  }

  render() {
    const wheelchairAccessibility = this.state.wheelchairAccessibility;

    function CustomRadio(props: { value: YesNoLimitedUnknown }) {
      const value = props.value;
      const isSelected = (wheelchairAccessibility === value);
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
      wheelchairAccessibility,
      this.props.className,
    ].filter(Boolean);

    const featureId = get(this.props.feature, 'properties.id');

    return (<section className={`${this.props.className} basic-accessibility-editor`}>
      <RadioGroup
        name="accessibility"
        selectedValue={wheelchairAccessibility}
        onChange={(newValue) => { this.setState({ wheelchairAccessibility: newValue }); }}
        className={classList.join(' ')}
      >
        {['yes', 'limited', 'no'].map(value => <CustomRadio key={value} value={value} />)}
      </RadioGroup>

      <footer>
        <Link to={featureId ? `/beta/nodes/${featureId}` : '/beta/'} className="link-button negative-button">Cancel</Link>
        <button className="link-button primary-button">Save</button>
      </footer>
    </section>);
  }
}


const StyledAccessibilityEditor = styled(AccessibilityEditor)`
  display: flex;
  flex-direction: column;

  > header, footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  > footer {
    margin-top: 1.5em;
  }

  label > header {
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
