// @flow

import get from 'lodash/get';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import { accessibleToiletDescription } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoUnknown } from '../../../lib/Feature';
import colors from '../../../lib/colors';


type Props = {
  feature: WheelmapFeature,
  className: string,
};


type State = {
  toiletAccessibility: YesNoUnknown,
};


class ToiletStatusEditor extends Component<Props, State> {
  props: Props;
  state = {
    toiletAccessibility: 'unknown',
  };

  toiletAccessibility(): ?YesNoUnknown {
    if (!this.props.feature || !this.props.feature.properties || !this.props.feature.properties.wheelchair_toilet) {
      return null;
    }
    return this.props.feature.properties.wheelchair_toilet;
  }

  componentWillReceiveProps(props: Props) {
    const toiletAccessibility = this.toiletAccessibility(props);
    if (toiletAccessibility) {
      this.setState({ toiletAccessibility });
    }
  }

  render() {
    const classList = [
      this.props.className,
      'basic-accessibility-editor',
    ].filter(Boolean);

    const featureId = get(this.props.feature, 'properties.id');

    // const toiletAccessibility = this.state.toiletAccessibility;
    // const valueHasChanged = toiletAccessibility !== this.toiletAccessibility();
    // const hasBeenUnknownBefore = this.toiletAccessibility() === 'unknown';

    return (<section className={classList.join(' ')}>
      <header>Is the toilet here wheelchair accessible?</header>

      <ul className="subtle">
        {accessibleToiletDescription.map((text, i) => <li key={i}>{text}</li>)}
      </ul>

      <footer>
        <button className="link-button yes">
          Yes
        </button>
        <button className="link-button no">
          No
        </button>
        <Link
          to={featureId ? `/beta/nodes/${featureId}` : '/beta/'}
          className="link-button unknown"
        >
          I don’t know
        </Link>
      </footer>
    </section>);
  }
}

const StyledToiletStatusEditor = styled(ToiletStatusEditor)`
  ul {
    margin: 1em 0;
    padding-left: 1.25em;
  }

  footer {
    .link-button {
      flex: 1;
      font-weight: bold;
      text-align: center;

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
