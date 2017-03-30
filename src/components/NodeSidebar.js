import React, { Component } from 'react';
import NodeHeader from './NodeHeader';
import WheelmapAccessibilityHeader from './WheelmapAccessibilityHeader';
import ShareButton from './ShareButton';
import ReportProblemButton from './ReportProblemButton';

export default class NodeSidebar extends Component {
  static propTypes = {
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        id: React.PropTypes.string,
      }),
    }).isRequired,
    className: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      node: {
        id: props.match.params.id,
      },
    };
  }

  componentWillReceiveNewProps(newProps) {
    this.setState({
      node: Object.assign(this.state.node, {
        id: newProps.match.id,
      }),
    });
  }

  render() {
    return (<section className={this.props.className}>
      <NodeHeader node={this.state.node} />
      <WheelmapAccessibilityHeader node={this.state.node} />
      <footer>
        <a href={`/de/nodes/${this.state.node.id}`}>
          Details
        </a>
        <a href={`/de/nodes/${this.state.node.id}/edit`}>
          Edit
        </a>
        <ShareButton node={this.state.node} />
        <ReportProblemButton node={this.state.node} />
      </footer>
    </section>);
  }
}
