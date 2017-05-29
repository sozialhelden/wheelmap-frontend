// @flow

import React, { Component } from 'react';
import type { Point } from 'geojson-flow';
import NodeHeader from './NodeHeader';
import WheelmapAccessibilityHeader from './WheelmapAccessibilityHeader';
import NodeFooter from './NodeFooter';
import Toolbar from '../Toolbar';

type Props = {
  match: {
    params: {
      id: string,
    },
  },
};

type State = {
  node: ?Point,
};

export default class NodeToolbar extends Component<*, Props, State> {
  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {};
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
