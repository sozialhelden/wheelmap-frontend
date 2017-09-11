// @flow

import get from 'lodash/get';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { RadioGroup } from 'react-radio-group';
import CustomRadio from './CustomRadio';
import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';


type Props = {
  feature: WheelmapFeature,
  className: string,
};


type State = {
  wheelchairAccessibility: YesNoLimitedUnknown,
};


export default class WheelchairStatusEditor extends Component<void, Props, State> {
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

  componentWillReceiveProps(props: Props) {
    const wheelchairAccessibility = this.wheelchairAccessibility(props);
    if (wheelchairAccessibility) {
      this.setState({ wheelchairAccessibility });
    }
  }

  render() {
    const wheelchairAccessibility = this.state.wheelchairAccessibility;

    const classList = [
      this.props.className,
      'basic-accessibility-editor',
    ].filter(Boolean);

    const featureId = get(this.props.feature, 'properties.id');

    const valueHasChanged = wheelchairAccessibility !== this.wheelchairAccessibility();

    const hasBeenUnknownBefore = this.wheelchairAccessibility() === 'unknown';
    let saveButtonCaption = 'Confirm';
    if (valueHasChanged) saveButtonCaption = 'Change';
    if (hasBeenUnknownBefore) saveButtonCaption = 'Continue';

    const backButtonCaption = valueHasChanged ? 'Cancel' : 'Back';

    return (<section className={classList.join(' ')}>
      <header>How wheelchair accessible is this place?</header>

      <RadioGroup
        name="accessibility"
        selectedValue={wheelchairAccessibility}
        onChange={(newValue) => { this.setState({ wheelchairAccessibility: newValue }); }}
        className={`${wheelchairAccessibility} radio-group`}
      >
        {['yes', 'limited', 'no'].map(value => (<CustomRadio
          key={value}
          shownValue={value}
          currentValue={wheelchairAccessibility}
          caption={shortAccessibilityName(value)}
          description={accessibilityDescription(value)}
        />))}
      </RadioGroup>

      <footer>
        <Link
          to={featureId ? `/beta/nodes/${featureId}` : '/beta/'}
          className={`link-button ${valueHasChanged ? 'negative-button' : ''}`}
        >
          {backButtonCaption}
        </Link>
        {valueHasChanged ? (<button className="link-button primary-button">
          {saveButtonCaption}
        </button>) : null}
      </footer>
    </section>);
  }
}
