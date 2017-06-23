// @flow

import React, { Component } from 'react';
import type { Point } from 'geojson-flow';
import NodeHeader from './NodeHeader';
import WheelmapAccessibilityHeader from './WheelmapAccessibilityHeader';
import ShareButton from './ShareButton';
import ReportProblemButton from './ReportProblemButton';
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
    const id = this.id()
    return (<Toolbar>
      <NodeHeader node={this.state.node} />
      <WheelmapAccessibilityHeader node={this.state.node} />
      <Link to='/'>Close</Link>
      <footer>
        <a href={`/de/nodes/${id}`}>
          Details
        </a>
        <a href={`/de/nodes/${id}/edit`}>
          Edit
        </a>
        <ShareButton node={this.state.node} />
        <ReportProblemButton node={this.state.node} />
      </footer>
    </Toolbar>);
  }

}
