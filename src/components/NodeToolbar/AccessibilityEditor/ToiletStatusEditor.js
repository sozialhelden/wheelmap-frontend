// @flow

import { currentLocale } from '../../../lib/i18n';
import * as React from 'react';
import styled from 'styled-components';
import { t } from '../../../lib/i18n';
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
    };

    wheelmapFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair_toilet: value });
    wheelmapLightweightFeatureCache.updateFeatureAttribute(String(featureId), { wheelchair_toilet: value });

    fetch(`/nodes/${featureId}/update_toilet.js`, options);

    if (typeof this.props.onSave === 'function') this.props.onSave(value);
    if (typeof this.props.onClose === 'function') this.props.onClose();
  }

  trapFocus({nativeEvent}) {
    if (nativeEvent.target === this.yesButton && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.unknownButton.focus();
    }
    if (nativeEvent.target === this.unknownButton && nativeEvent.key === 'Tab' && !nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.yesButton.focus();
    }
  }

  focus() {
    this.yesButton.focus();
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

    // translator: Header for the toilet accessibility checklist (while marking toilet status)
    const toiletAccessibilityExplanationHeader = t`This means:`;

    const useImperialUnits = currentLocale === 'en' || Boolean(currentLocale.match(/(UK|US)$/));

    return (<section className={classList.join(' ')}>
      <header>{headerText}</header>

      <footer>
        <button
          className="link-button yes"
          onClick={() => this.save('yes')}
          ref={yesButton => this.yesButton = yesButton}
          onKeyDown={this.trapFocus}
        >
          {yesCaption}
        </button>

        <button className="link-button no" onClick={() => this.save('no')}>
          {noCaption}
        </button>

        <button
          className="link-button unknown"
          onClick={() => this.save('unknown')}
          ref={unknownButton => this.unknownButton = unknownButton}
          onKeyDown={this.trapFocus}
        >
          {unknownCaption}
        </button>
      </footer>

      <p className="subtle">{toiletAccessibilityExplanationHeader}</p>

      <ul className="subtle">
        {accessibleToiletDescription(useImperialUnits).map(text => <li key={text}>{text}</li>)}
      </ul>
    </section>);
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
        &:hover, &:active {
          color: ${colors.positiveColor};
          background-color: ${colors.positiveBackgroundColorTransparent};
        }
      }

      &.no {
        &:hover, &:active {
          color: ${colors.negativeColor};
          background-color: ${colors.negativeBackgroundColorTransparent};
        }
      }
    }
  }
`;

export default StyledToiletStatusEditor;
