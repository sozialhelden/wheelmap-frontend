// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { accessibleToiletDescription } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoUnknown } from '../../../lib/Feature';
import colors from '../../../lib/colors';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';

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


class ToiletStatusEditor extends Component<Props, State> {
  props: Props;
  state = {
    toiletAccessibility: 'unknown',
  };

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

    fetch(`/nodes/${featureId}/update_toilet.js`, options);

    if (typeof this.props.onSave === 'function') this.props.onSave(value);
    if (typeof this.props.onClose === 'function') this.props.onClose();
  }

  render() {
    const classList = [
      this.props.className,
      'basic-accessibility-editor',
    ].filter(Boolean);

    return (<section className={classList.join(' ')}>
      <header>Is the toilet here wheelchair accessible?</header>

      <footer>
        <button className="link-button yes" onClick={() => this.save('yes')}>
          Yes
        </button>
        <button className="link-button no" onClick={() => this.save('no')}>
          No
        </button>
        <button className="link-button unknown" onClick={() => this.save('unknown')}>
          I don’t know
        </button>
      </footer>

      <p className="subtle">This means:</p>

      <ul className="subtle">
        {accessibleToiletDescription.map(text => <li key={text}>{text}</li>)}
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
