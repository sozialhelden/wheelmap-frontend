import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Toolbar extends Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <nav className={this.props.className}>
        <Link to="/">Wheelmap</Link>
        <Link to="/about">About</Link>
        <Link to="/topics">Topics</Link>
      </nav>
    )
  }
}
