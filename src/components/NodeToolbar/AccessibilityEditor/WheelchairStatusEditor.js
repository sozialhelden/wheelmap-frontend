// @flow

import styled from 'styled-components';
import * as React from 'react';
import CustomRadio from './CustomRadio';
import StyledRadioGroup from './StyledRadioGroup';
import { t } from 'c-3po';
import fetch from '../../../lib/fetch';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import Icon from '../../Icon';
import getIconNameForProperties from '../../Map/getIconNameForProperties';

type Props = {
  featureId: number,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className: string,
  onSave: ?((YesNoLimitedUnknown) => void),
  onClose: (() => void),
};


type State = {
  wheelchairAccessibility: YesNoLimitedUnknown,
};


class WheelchairStatusEditor extends React.Component<Props, State> {
  props: Props;

  state = {
    wheelchairAccessibility: 'unknown',
  };

  constructor(props) {
    super(props);
    const wheelchairAccessibility = this.wheelchairAccessibility(props);
    if (wheelchairAccessibility) {
      this.state = { wheelchairAccessibility };
    }

    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onRadioGroupKeyDown = this.onRadioGroupKeyDown.bind(this);
  }

  wheelchairAccessibility(props: Props = this.props): ?YesNoLimitedUnknown {
    if (!props.feature || !props.feature.properties || !props.feature.properties.wheelchair) {
      return null;
    }
    return props.feature.properties.wheelchair;
  }

  componentWillReceiveProps(props: Props) {
    const wheelchairAccessibility = this.wheelchairAccessibility(props);
    if (wheelchairAccessibility) {
      this.setState({ wheelchairAccessibility });
    }
  }

  componentDidMount() {
    this.toBeFocusedRadioButton.focus();
  }

  onRadioGroupKeyDown({nativeEvent}) {
    if(nativeEvent.key === 'Enter') {
      this.onSaveButtonClick();
    }
  }

  onSaveButtonClick() {
    const wheelchairAccessibility = this.state.wheelchairAccessibility;
    const valueIsDefined = wheelchairAccessibility !== 'unknown';

    if (valueIsDefined) {
      this.save(wheelchairAccessibility);
      if (typeof this.props.onSave === 'function') {
        this.props.onSave(wheelchairAccessibility);
      }
    }
  }

  save(value: YesNoLimitedUnknown) {
    // Don't override existing values. If somebody does not know the new toilet status, we trust
    // the last information we have.

    if (value === 'unknown') {
      if (typeof this.props.onClose === 'function') this.props.onClose();
    }

    const featureId = this.props.featureId;

    const formData = new FormData();
    formData.append('wheelchair', value);
    formData.append('_method', 'PUT');

    const options = {
      method: 'POST',
      body: formData,
      cordova: true,
    };

    wheelmapFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair: value });
    wheelmapLightweightFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair: value });

    fetch(`/nodes/${featureId}/update_wheelchair.js`, options);

    if (typeof this.props.onSave === 'function') this.props.onSave(value);
    if (typeof this.props.onClose === 'function') this.props.onClose();
  }

  render() {
    const wheelchairAccessibility = this.state.wheelchairAccessibility;

    const classList = [
      this.props.className,
      'basic-accessibility-editor',
    ].filter(Boolean);

    const valueHasChanged = wheelchairAccessibility !== this.wheelchairAccessibility();
    const valueIsDefined = wheelchairAccessibility !== 'unknown';
    const hasBeenUnknownBefore = this.wheelchairAccessibility() === 'unknown';

    // translator: Button caption shown while editing a place’s wheelchair status
    const confirmButtonCaption = t`Confirm`;

    // translator: Button caption shown while editing a place’s wheelchair status
    const changeButtonCaption = t`Change`;

    // translator: Button caption shown while editing a place’s wheelchair status
    const continueButtonCaption = t`Continue`;

    // translator: Button caption shown while editing a place’s wheelchair status
    const cancelButtonCaption = t`Cancel`;

    // translator: Button caption shown while editing a place’s wheelchair status
    const backButtonCaption = t`Back`;

    let saveButtonCaption = confirmButtonCaption;
    if (valueHasChanged) saveButtonCaption = changeButtonCaption;
    if (hasBeenUnknownBefore) saveButtonCaption = continueButtonCaption;

    const backOrCancelButtonCaption = valueHasChanged ? cancelButtonCaption : backButtonCaption;

    const properties = this.props.feature.properties;
    const categoryId = properties && ((properties.node_type && properties.node_type.identifier) || properties.category);
    const category = categoryId ? { _id: categoryId } : { _id: 'other' };

    return (
      <section
        className={classList.join(' ')}
        role="dialog"
        aria-labelledby="wheelchair-accessibility-header"
      >
        <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>

        <StyledRadioGroup
          name="accessibility"
          selectedValue={wheelchairAccessibility}
          onChange={(newValue) => { this.setState({ wheelchairAccessibility: newValue }); }}
          className={`${wheelchairAccessibility} ${valueIsDefined ? 'has-selection' : ''} radio-group`}
          onKeyDown={this.onRadioGroupKeyDown}
          role="radiogroup"
          aria-label={t`Wheelchair Accessibility`}
        >
          {['yes', 'limited', 'no'].map((value, index) =>
            <CustomRadio
              key={value}
              ref={radioButton => {
                const radioButtonIsSelected = value === wheelchairAccessibility;

                if (radioButtonIsSelected) {
                  this.toBeFocusedRadioButton = radioButton;
                } else if (index === 0) {
                  this.toBeFocusedRadioButton = radioButton;
                }
              }}
              children={<Icon accessibility={value} category={category} size='small' withArrow shadowed />}
              shownValue={value}
              currentValue={wheelchairAccessibility}
              caption={shortAccessibilityName(value)}
              description={accessibilityDescription(value)}
            />
          )}
        </StyledRadioGroup>

        <footer>
          <button
            className={`link-button ${valueHasChanged ? 'negative-button' : ''}`}
            onClick={this.props.onClose}
          >
            {backOrCancelButtonCaption}
          </button>
          <button
            className="link-button primary-button"
            disabled={!valueIsDefined}
            onClick={this.onSaveButtonClick}
          >
            {saveButtonCaption}
          </button>
        </footer>
      </section>
    );
  }
}

const StyledWheelchairStatusEditor = styled(WheelchairStatusEditor)`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0 0 0;

  > header, footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }

  figure {
    margin-right: 8px;
    top: 0;
    left: 0;
  }
`;

export default StyledWheelchairStatusEditor;
