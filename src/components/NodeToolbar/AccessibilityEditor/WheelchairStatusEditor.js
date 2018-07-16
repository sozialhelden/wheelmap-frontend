// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';

import fetch from '../../../lib/fetch';
import config from '../../../lib/config';
import Categories from '../../../lib/Categories';
import getIconNameForProperties from '../../Map/getIconNameForProperties';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';

import Icon from '../../Icon';
import CustomRadio from './CustomRadio';
import StyledRadioGroup from './StyledRadioGroup';
import CloseLink from '../../CloseLink';


type Props = {
  featureId: number,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className: string,
  onSave: ?((YesNoLimitedUnknown) => void),
  onClose: (() => void),
  presetStatus: YesNoLimitedUnknown,
  inline: ?boolean,
};


type State = {
  wheelchairAccessibility: YesNoLimitedUnknown,
  categoryId: string,
};

class WheelchairStatusEditor extends React.Component<Props, State> {
  props: Props;

  state = {
    wheelchairAccessibility: null,
    categoryId: 'other'
  };

  constructor(props) {
    super(props);
    debugger
    const wheelchairAccessibility = this.wheelchairAccessibility(props);
    if (wheelchairAccessibility) {
      this.state = { wheelchairAccessibility, categoryId: 'other' };
    }
    this.fetchCategory(this.props.feature);

    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onRadioGroupKeyDown = this.onRadioGroupKeyDown.bind(this);
  }

  wheelchairAccessibility(props: Props = this.props): ?YesNoLimitedUnknown {
    if (!props.feature || !props.feature.properties || !props.feature.properties.wheelchair) {
      return this.props.presetStatus;
    }
    const featureValue = props.feature.properties.wheelchair;
    if (featureValue === 'unknown') {
      return this.props.presetStatus || featureValue;
    }
    return featureValue;
  }

  fetchCategory(feature: WheelmapFeature) {
    if (!feature) {
      return;
    }
    const properties = feature.properties;
    if (!properties) {
      return;
    }

    const categoryId =
      (properties.node_type && properties.node_type.identifier) || properties.category;

    if (!categoryId) {
      return;
    }

    Categories.getCategory(categoryId).then(() => {
      const iconId = getIconNameForProperties(properties);
      this.setState({categoryId: iconId});
    })
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

  closeButtonClick = (event) => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
      // prevent clicking the next close button as well
      event.preventDefault();
      event.stopPropagation();
    }
  }

  save(value: YesNoLimitedUnknown) {
    // Don't override existing values. If somebody does not know the new toilet status, we trust
    // the last information we have.

    if (value === 'unknown') {
      if (typeof this.props.onClose === 'function') this.props.onClose();
    }

    const featureId = this.props.featureId;

    let formData = null;

    formData = new FormData();
    formData.append('wheelchair', value);
    const options = {
      method: 'PUT',
      body: window.cordova ? { wheelchair: value } : formData,
      cordova: true,
      serializer: 'urlencoded',
    };

    if (wheelmapFeatureCache.getCachedFeature(String(featureId))) {
      wheelmapFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair: value });
    }
    if (wheelmapLightweightFeatureCache.getCachedFeature(String(featureId))) {
      wheelmapLightweightFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair: value });
    }

    fetch(`${config.wheelmapApiBaseUrl}/nodes/${featureId}/update_wheelchair.js`, options)
      .then(() => {
        setTimeout(() => {
          if (typeof this.props.onSave === 'function') this.props.onSave(value);
          if (typeof this.props.onClose === 'function') this.props.onClose();
        });
      })
      .catch((e) => {
        window.alert(t`Sorry, could not mark this place because of an error: ${e}`);
      });
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

    return (
      <section
        className={classList.join(' ')}
        role="dialog"
        aria-labelledby="wheelchair-accessibility-header"
      >
        <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>
        {!this.props.inline && <CloseLink 
          className='close-link'
          onClick={this.closeButtonClick}
          />}

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
              children={<Icon accessibility={value} category={{ _id: this.state.categoryId }} size='small' withArrow shadowed centered />}
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

  .close-link {
    top: 5px;
    right: 8px;
    position: absolute;
    background-color: transparent;
    display: flex;
    flex-direction: row-reverse;
  }
`;

export default StyledWheelchairStatusEditor;
