// @flow

import includes from 'lodash/includes';
import styled from 'styled-components';
import React, { Component } from 'react';
import WheelchairStatusEditor from './WheelchairStatusEditor';
import ToiletStatusEditor from './ToiletStatusEditor';
import type { WheelmapFeature, YesNoLimitedUnknown, YesNoUnknown } from '../../../lib/Feature';


type Props = {
  featureId: number,
  feature: WheelmapFeature,
  className: string,
  onClose: (() => void),
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
        featureId={this.props.featureId}
        feature={this.props.feature}
        onSave={(newValue: YesNoUnknown) => this.props.onClose()}
        onClose={this.props.onClose}
      />);
    }

    return (<WheelchairStatusEditor
      className={className}
      featureId={this.props.featureId}
      feature={this.props.feature}
      onSave={(newValue) => {
        if (includes(['yes', 'limited'], newValue)) {
          this.setState({ isInToiletEditingMode: true });
        } else {
          this.props.onClose();
        }
      }}
      onClose={this.props.onClose}
    />);
  }
}


const StyledAccessibilityEditor = styled(AccessibilityEditor)`

`;

export default StyledAccessibilityEditor;
