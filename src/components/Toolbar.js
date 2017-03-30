import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Toolbar extends Component {
  render() {
    return (
      <nav>
        <Link to="/">Wheelmap</Link>
        <Link to="/about">About</Link>
        <Link to="/topics">Topics</Link>
      </nav>
    )
  }
}
