// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import AccessibilityDetails from 'accessibility-cloud-widget/lib/components/AccessibilityDetails';
import 'accessibility-cloud-widget/src/app.css';

import { isWheelmapFeatureId } from '../../lib/Feature';

import type { Feature } from '../../lib/Feature';

import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapFeatureCache } from '../../lib/cache/WheelmapFeatureCache';

import Toolbar from '../Toolbar';
import NodeHeader from './NodeHeader';
import NodeFooter from './NodeFooter';
import CloseLink from './CloseLink';


type Props = {
  match: {
    params: {
      id: string,
    },
  },
};

type State = {
  node?: Feature,
  fetching: boolean,
};


const StyledAccessibilityDetails = styled(AccessibilityDetails)`
  width: 100%;
  box-sizing: border-box;
  line-height: 1.3;
  font-weight: 300;
  color: #444;

  ul {
    list-style: none;
  }

  .ac-result-list,
  .ac-details > .ac-group {
    margin-left: 0;
  }

  .ac-details > dl.ac-group {
    padding: 0;
  }

  .ac-details em {
    font-style: normal;
  }

  .ac-group > .subtle {
    font-weight: 400;
  }

  dl {
      width: 100%;
      /*display: block;*/
      /*background-color: rgba(0, 0, 0, 0.1);*/
      overflow: auto;
      margin: 0;
  }

  dt {
      /*background-color: rgba(255, 0, 0, 0.1);*/
      float: left;
      clear: left;
      margin: 0;
      padding: 0;
  }

  > dt {
    margin-top: 0.5em;
  }

  dt[data-key] {
      font-weight: bolder;
  }

  dd {
      /*background-color: rgba(0, 255, 0, 0.1);*/
      margin-left: 1em;
      display: table-cell;
      padding: 0 0 0 0.3em;
  }

  dt[data-key="areas"] {
    display: none
  }

  dt[data-key="areas"] + dd {
    padding: 0;
  }

  dt[data-key="entrances"] {
    width: 100%;
  }

  dt[data-key="entrances"] + dd {
    padding-left: 0;
  }

  .ac-group header {
    margin: 0.5em 0 0 0;
  }

  dt {
    margin-right: 0.5em;
    font-weight: normal;
    &[data-key] {
      font-weight: bold;
    }
  }

  dd {
    display: block;
    padding: 0;
  }

  dt[data-key="areas"] + dd {
    margin-left: 0;
  }
`;

export default class NodeToolbar extends Component<*, Props, State> {
  state: State = { fetching: false };


  componentDidMount() {
    this.fetchFeature(this.props);
  }


  componentWillReceiveProps(newProps: Props): void {
    this.fetchFeature(newProps);
  }


  id(props: Props = this.props): ?string {
    return props.match && props.match.params.id;
  }


  fetchFeature(props: Props): void {
    const id = this.id(props);
    if (!id) return;
    this.setState({ fetching: true });
    const isWheelmap = isWheelmapFeatureId(id);
    if (isWheelmap) {
      this.setState({ node: wheelmapLightweightFeatureCache.getCachedFeature(id) });
    }
    const cache = isWheelmap ? wheelmapFeatureCache : accessibilityCloudFeatureCache;
    cache.getFeature(id).then(node => {
      const currentlyShownId = this.id(this.props);
      const idProperties = [node._id, node.id, node.properties.id, node.properties._id];
      const fetchedId = String(idProperties.filter(Boolean)[0]);
      // shown node might have changed in the mean time. `fetch` requests cannot be aborted so
      // we ignore the response here instead.
      if (fetchedId !== currentlyShownId) return;
      this.setState({ node, fetching: false });
    });
  }


  render() {
    const properties = this.state.node && this.state.node.properties;
    const accessibility = properties && properties.accessibility;
    return (
      <Toolbar>
        <CloseLink />
        <NodeHeader node={this.state.node} />
        <StyledAccessibilityDetails details={accessibility} />
        <NodeFooter
          feature={this.state.node}
          featureId={this.props.match && this.props.match.params.id}
        />
      </Toolbar>
    );
  }
}
