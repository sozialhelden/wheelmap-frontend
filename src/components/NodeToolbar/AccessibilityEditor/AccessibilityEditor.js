// @flow

import includes from 'lodash/includes';
import styled from 'styled-components';
import React, { Component } from 'react';
import WheelchairStatusEditor from './WheelchairStatusEditor';
import ToiletStatusEditor from './ToiletStatusEditor';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import colors from '../../../lib/colors';


type Props = {
  feature: WheelmapFeature,
  className: string,
};


type State = {
  isInToiletEditingMode: boolean,
};


class AccessibilityEditor extends Component<Props, State> {
  props: Props;
  state = {
    isInToiletEditingMode: false,
  };

  wheelchairAccessibility(): ?YesNoLimitedUnknown {
    if (!this.props.feature || !this.props.feature.properties || !this.props.feature.properties.wheelchair) {
      return null;
    }
    return this.props.feature.properties.wheelchair;
  }


  componentWillMount() {
    const wheelchairAccessibility = this.wheelchairAccessibility();
    if (wheelchairAccessibility && wheelchairAccessibility !== 'unknown') {
      this.setState({ isInToiletEditingMode: true });
    }
  }

  render() {
    const classList = [
      this.props.className,
      'accessibility-editor',
    ].filter(Boolean);

    const className = classList.join(' ');
    const isInToiletEditingMode = this.state.isInToiletEditingMode;
    if (isInToiletEditingMode) {
      return (<ToiletStatusEditor
        className={className}
        feature={this.props.feature}
        onSave={() => this.props.onSave()}
      />);
    }

    return (<WheelchairStatusEditor
      className={className}
      feature={this.props.feature}
      onSave={(newValue) => {
        if (includes(['yes', 'limited'], newValue)) {
          this.setState({ isInToiletEditingMode: true });
        }
      }}
    />);
  }
}


const StyledAccessibilityEditor = styled(AccessibilityEditor)`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0 0 0;

  .radio-group {
    margin-top: 1em;

    &.yes label.yes {
      background-color: ${colors.positiveBackgroundColorTransparent};
      > header span {
        color: ${colors.positiveColor};
      }
    }

    &.limited label.limited {
      background-color: ${colors.warningBackgroundColorTransparent};
      > header span {
        color: ${colors.warningColor};
      }
    }

    &.no label.no {
      background-color: ${colors.negativeBackgroundColorTransparent};
      > header span {
        color: ${colors.negativeColor};
      }
    }
  }

  > header, footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }

  ul > li + li {
    margin-top: 0.5em;
  }

  label {
    margin: -0.5em;
    padding: 0.5em;
    margin-bottom: 1em;
    border-radius: 0.25em;
    display: flex;
    flex-direction: column;
    &[for="toilet-status"] {
      flex-direction: row;
      justify-content: space-between;
    }

    header {
      display: flex;
      align-items: center;
      font-weight: bold;
    }
    footer {
      margin: 0.5em 0 0 0;
      opacity: 0.6;
    }
    cursor: pointer;
    input {
      width: 0;
      height: 0;
      opacity: 0;
      box-sizing: border-box;
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
