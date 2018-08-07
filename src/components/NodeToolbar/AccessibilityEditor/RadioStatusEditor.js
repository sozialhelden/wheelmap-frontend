// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import Categories from '../../../lib/Categories';
import getIconNameForProperties from '../../Map/getIconNameForProperties';
import type { WheelmapFeature } from '../../../lib/Feature';
import CustomRadio from './CustomRadio';
import StyledRadioGroup from './StyledRadioGroup';
import CloseLink from '../../CloseLink';


type Props = {
  featureId: number,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types

  onSave: ?((value: string) => void),
  onClose: (() => void),

  inline: ?boolean,
  shownStatusOptions: string[],
  presetStatus?: ?string,
  undefinedStringValue: string,
  renderChildrenForValue: (({ value: string, categoryId: string }) => React.Node),
  getValueFromFeature: ((feature: WheelmapFeature) => string),
  saveValue: ((selectedValue: string) => Promise<Response>),
  descriptionForValue: ((value: string) => string),
  captionForValue: ((value: string) => string),

  children: React.Node,
  className: string,
};


type State = {
  selectedValue: ?string,
  categoryId: ?string,
  busy: boolean,
};


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


class RadioStatusEditor extends React.Component<Props, State> {
  state : State = {
    categoryId: 'other',
    selectedValue: null,
    busy: false,
  };

  radioButtonToFocusOnStart: ?React.ElementRef<CustomRadio>;


  constructor(props) {
    super(props);

    const selectedValue = this.selectedValue(props);
    if (selectedValue) {
      this.state = { selectedValue, categoryId: 'other' };
    }
    this.fetchCategory(this.props.feature);
  }


  selectedValue(props: Props = this.props): ?string {
    if (!props.feature || !props.feature.properties) {
      return this.props.presetStatus;
    }
    const featureValue = props.getValueFromFeature(props.feature) || this.props.presetStatus;
    if (featureValue === props.undefinedStringValue) {
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
    });
  }


  componentWillReceiveProps(props: Props) {
    const selectedValue = this.selectedValue(props);
    if (selectedValue) {
      this.setState({ selectedValue });
    }
  }


  componentDidMount() {
    if (this.radioButtonToFocusOnStart) {
      this.radioButtonToFocusOnStart.focus();
    }
  }


  onRadioGroupKeyDown = ({nativeEvent}) => {
    if(nativeEvent.key === 'Enter') {
      this.onSaveButtonClick();
    }
  }


  onSaveButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedValue = this.state.selectedValue;
    if (selectedValue && selectedValue !== this.props.undefinedStringValue) {
      this.props.saveValue(selectedValue);
      this.setState({busy: true});
    }
  };


  closeButtonClick = (event) => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
      // prevent clicking the next close button as well
      event.preventDefault();
      event.stopPropagation();
    }
  }


  renderCloseButton() {
    return !this.props.inline && <CloseLink onClick={this.closeButtonClick} />;
  }


  renderRadioGroup() {
    const { selectedValue, busy } = this.state;
    const valueIsDefined = selectedValue !== 'unknown';

    // translator: Screen reader description for the accessibility choice buttons in the wheelchair accessibility editor dialog
    const ariaLabel = t`Wheelchair Accessibility`;

    return <StyledRadioGroup
      name="accessibility"
      selectedValue={selectedValue}
      onChange={(newValue) => { this.setState({ selectedValue: newValue }); }}
      className={`${selectedValue || ''} ${valueIsDefined ? 'has-selection' : ''} radio-group`}
      onKeyDown={this.onRadioGroupKeyDown}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {this.props.shownStatusOptions.map((value, index) =>
        <CustomRadio
          key={String(value)}
          disabled={busy}
          ref={radioButton => {
            const radioButtonIsSelected = value === selectedValue;
            if (radioButtonIsSelected) {
              this.radioButtonToFocusOnStart = radioButton;
            } else if (index === 0) {
              this.radioButtonToFocusOnStart = radioButton;
            }
          }}
          children={this.props.renderChildrenForValue({ value, categoryId: this.state.categoryId || 'other' })}
          shownValue={value ? String(value) : null}
          currentValue={selectedValue ? String(selectedValue) : null}
          caption={this.props.captionForValue(value)}
          description={this.props.descriptionForValue(value)}
        />
      )}
    </StyledRadioGroup>;
  }


  renderFooter() {
    const valueHasChanged = this.state.selectedValue !== this.selectedValue();
    const backOrCancelButtonCaption = valueHasChanged ? cancelButtonCaption : backButtonCaption;
    const hasBeenUnknownBefore = this.selectedValue() === 'unknown';
    const isUnknown = this.state.selectedValue === 'unknown';

    let saveButtonCaption = confirmButtonCaption;
    if (valueHasChanged) saveButtonCaption = changeButtonCaption;
    if (hasBeenUnknownBefore) saveButtonCaption = continueButtonCaption;

    return <footer>
      <button
        className={`link-button ${valueHasChanged ? 'negative-button' : ''}`}
        onClick={this.closeButtonClick}
      >
        {backOrCancelButtonCaption}
      </button>
      <button
        className="link-button primary-button"
        disabled={isUnknown || this.state.busy}
        onClick={this.onSaveButtonClick}
      >
        {saveButtonCaption}
      </button>
    </footer>;
  }

  render() {
    return (
      <section
        className={this.props.className}
        role="dialog"
        aria-labelledby="wheelchair-accessibility-header"
      >
        {this.props.children}
        {this.renderCloseButton()}
        {this.renderRadioGroup()}
        {this.renderFooter()}
      </section>
    );
  }
}

const StyledWheelchairStatusEditor = styled(RadioStatusEditor)`
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
