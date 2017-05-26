// @flow

import React, { Component } from 'react';
import type { Point } from 'geojson-flow';
import NodeHeader from './NodeHeader';
import WheelmapAccessibilityHeader from './WheelmapAccessibilityHeader';
import ShareButton from './ShareButton';
import ReportProblemButton from './ReportProblemButton';
import Toolbar from '../Toolbar';
import { Link } from 'react-router-dom';


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
    return (<Toolbar>
      <NodeHeader node={this.state.node} />
      <WheelmapAccessibilityHeader node={this.state.node} />
      <Link to='/'>Close</Link>
      <footer>
        <a href={`/de/nodes/${this.props.match.params.id}`}>
          Details
        </a>
        <a href={`/de/nodes/${this.props.match.params.id}/edit`}>
          Edit
        </a>
        <ShareButton node={this.state.node} />
        <ReportProblemButton node={this.state.node} />
      </footer>
    </Toolbar>);
  }
}
