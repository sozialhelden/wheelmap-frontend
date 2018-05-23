// @flow

import fetch from '../../../lib/fetch';
import { currentLocales } from '../../../lib/i18n';
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'c-3po';
import CloseLink from '../../CloseLink';
import { accessibleToiletDescription } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoUnknown } from '../../../lib/Feature';
import colors from '../../../lib/colors';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';


type Props = {
  featureId: number,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className: string,
  onSave: ?((newValue: YesNoUnknown) => void),
  onClose: ?(() => void),
  inline: ?boolean 
};


type State = {
  toiletAccessibility: YesNoUnknown,
};


class ToiletStatusEditor extends React.Component<Props, State> {
  props: Props;
  state = {
    toiletAccessibility: 'unknown',
  };

  constructor(props) {
    super(props);
    this.trapFocus = this.trapFocus.bind(this);
    this.escapeHandler = this.escapeHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeHandler);
    this.unknownButton.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeHandler);
  }

  escapeHandler(event) {
    if (event.key === 'Escape') {
      if (typeof this.props.onClose === 'function') {
        this.props.onClose();
        event.preventDefault();
      }
    }
  }

  toiletAccessibility(props: Props = this.props): ?YesNoUnknown {
    if (!props.feature || !props.feature.properties || !props.feature.properties.wheelchair_toilet) {
      return null;
    }
    return props.feature.properties.wheelchair_toilet;
  }

  componentWillReceiveProps(props: Props) {
    const toiletAccessibility = this.toiletAccessibility(props);
    if (toiletAccessibility) {
      this.setState({ toiletAccessibility });
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

  save(value: YesNoUnknown) {
    // Don't override existing values. If somebody does not know the new toilet status, we trust
    // the last information we have.

    if (value === 'unknown') {
      if (typeof this.props.onClose === 'function') this.props.onClose();
      return;
    }

    const featureId = this.props.featureId;

    const formData = new FormData();
    formData.append('toilet', value);
    formData.append('_method', 'PUT');

    const options = {
      method: 'POST',
      body: formData,
      cordova: true,
    };

    wheelmapFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair_toilet: value });
    wheelmapLightweightFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair_toilet: value });

    fetch(`/nodes/${featureId}/update_toilet.js`, options);

    if (typeof this.props.onSave === 'function') this.props.onSave(value);
    if (typeof this.props.onClose === 'function') this.props.onClose();
  }

  trapFocus({nativeEvent}) {
    // allow looping through elements
    if (nativeEvent.target === this.unknownButton && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.backButton.focus();
    }
    if (nativeEvent.target === this.backButton && nativeEvent.key === 'Tab' && !nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.unknownButton.focus();
    }
  }

  render() {
    const classList = [
      this.props.className,
      'basic-accessibility-editor',
    ].filter(Boolean);

    // translator: Header for the toilet status prompt. Asks the user if the edited place’s toilet is wheelchair accessible.
    const headerText = t`Is the toilet here wheelchair accessible?`;

    // translator: Caption for the ‘yes’ radio button (while marking toilet status)
    const yesCaption = t`Yes`;

    // translator: Caption for the ‘no’ radio button (while marking toilet status)
    const noCaption = t`No`;

    // translator: Caption for the ‘I don’t know’ radio button (while marking toilet status)
    const unknownCaption = t`I don’t know`;

    // translator: Caption for the ‘no toilet’ radio button (while marking toilet status)
    const noToiletCaption = t`No toilet`;

    // translator: Header for the toilet accessibility checklist (while marking toilet status)
    const toiletAccessibilityExplanationHeader = t`This means:`;

    // translator: Button caption shown while editing a place’s toilet status
    const backButtonCaption = t`Back`;

    const useImperialUnits = currentLocales[0] === 'en' || Boolean(currentLocales[0].match(/(UK|US)$/));

    return (
      <section
        className={classList.join(' ')}
        role="dialog"
        aria-labelledby="toilet-status-editor-header"
      >
        <header id="toilet-status-editor-header">{headerText}</header>
        {!this.props.inline && <CloseLink 
          className='close-link' 
          onClick={this.closeButtonClick}
          innerRef={closeButton => this.closeButton = closeButton}
          onKeyDown={this.trapFocus}
          />}

        <footer>
          <button
            className="link-button unknown"
            onClick={() => this.save('unknown')}
            ref={unknownButton => this.unknownButton = unknownButton}
            onKeyDown={this.trapFocus}
            >
              {unknownCaption}
          </button>

          <button
            className="link-button yes"
            onClick={() => this.save('yes')}
            ref={yesButton => this.yesButton = yesButton}
            onKeyDown={this.trapFocus}
          >
            {yesCaption}
          </button>

          <button
            className="link-button no"
            onClick={() => this.save('no')}
            ref={noButton => this.noButton = noButton}
            onKeyDown={this.trapFocus}
          >
            {noCaption}
          </button>

          <button
            className="link-button no-toilet"
            onClick={() => { if (typeof this.props.onClose === 'function') this.props.onClose();}}
            ref={noToiletButton => this.noToiletButton = noToiletButton}
            onKeyDown={this.trapFocus}
          >
            {noToiletCaption}
          </button>

        </footer>

        <p className="subtle">{toiletAccessibilityExplanationHeader}</p>

        <ul className="subtle">
          {accessibleToiletDescription(useImperialUnits).map(text => <li key={text}>{text}</li>)}
        </ul>
        <footer>
          <button
            className={`link-button`}
            onClick={this.props.onClose}
            ref={backButton => this.backButton = backButton}
            onKeyDown={this.trapFocus}
          >
            {backButtonCaption}
          </button>
        </footer>

      </section>
    );
  }
}

const StyledToiletStatusEditor = styled(ToiletStatusEditor)`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0 0 0;

  ul {
    margin: 0 0 1em 0;
    padding-left: 1.25em;
  }

  ul > li + li {
    margin-top: 0.5em;
  }

  > header {
    font-weight: 500;
    margin: 0.5em 0;
  }

  > header, footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }

  footer {
    .link-button {
      margin: 0;
      color: ${colors.linkColorDarker}
    }
    .link-button + .link-button {
      margin-left: 10px;
    }

    .link-button {
      flex: 1;
      font-weight: bold;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.05);
      box-sizing: border-box;

      &.yes {
        &:hover, &:active, &:focus {
          color: ${colors.positiveColorDarker};
          background-color: ${colors.positiveBackgroundColorTransparent};
        }
      }

      &.no {
        &:hover, &:active, &:focus {
          color: ${colors.negativeColorDarker};
          background-color: ${colors.negativeBackgroundColorTransparent};
        }
      }
    }
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

export default StyledToiletStatusEditor;
