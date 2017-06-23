// @flow

import React, { Component } from 'react';
import type { Point } from 'geojson-flow';
import NodeHeader from './NodeHeader';
import WheelmapAccessibilityHeader from './WheelmapAccessibilityHeader';
import NodeFooter from './NodeFooter';
import Toolbar from '../Toolbar';
import { Link } from 'react-router-dom';
import { wheelmapFeatureCache } from '../../lib/WheelmapFeatureCache';
import { accessibilityCloudFeatureCache } from '../../lib/AccessibilityCloudFeatureCache';

type Props = {
  match: {
    params: {
      id: string,
    },
  },
};

type State = {
  feature: ?Feature,
};

function isNumeric(id) {
  return id.match(/^\d+$/)
}

export default class NodeToolbar extends Component<*, Props, State> {
  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }


  id(props: Props): string {
    return (props || this.props).match.params.id;
  }


  componentWillReceiveProps(newProps: Props): void {
    const id = this.id(newProps);
    const cache = isNumeric(id) ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    cache.getFeature(id).then(node => this.setState({ node }));
  }


  render() {
    return (
      <Toolbar>
        <NodeHeader node={this.state.node} />
        <WheelmapAccessibilityHeader node={this.state.node} />
        <NodeFooter
          node={this.state.node}
          node_id={this.props.match.params.id}
        />
      </Toolbar>
    );
  }

}
