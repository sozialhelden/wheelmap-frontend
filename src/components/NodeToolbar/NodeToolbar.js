// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import AccessibilityDetails from 'accessibility-cloud-widget/lib/components/AccessibilityDetails';
import 'accessibility-cloud-widget/src/app.css';

import Toolbar from '../Toolbar';
import NodeHeader from './NodeHeader';
import NodeFooter from './NodeFooter';
import CloseLink from '../CloseLink';


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


const PositionedCloseLink = styled(CloseLink)`
  top: 9px;
  right: 0;
`;

export default class NodeToolbar extends Component<*, Props, State> {
  render() {
    const properties = this.props.feature && this.props.feature.properties;
    const accessibility = properties && properties.accessibility;
    return (
      <Toolbar>
        <PositionedCloseLink />
        <NodeHeader feature={this.props.feature} />
        <StyledAccessibilityDetails details={accessibility} />
        <NodeFooter
          feature={this.props.feature}
          featureId={this.props.featureId}
        />
      </Toolbar>
    );
  }
}
