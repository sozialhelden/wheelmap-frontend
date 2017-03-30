import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  CategoryButton,
  CategoryMenu,
} from './Categories';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryMenuIsVisible: false,
    };
    this.toggleCategoryMenu = this.toggleCategoryMenu.bind(this);
  }

  toggleCategoryMenu() {
    this.setState(prevState => ({
      categoryMenuIsVisible: !prevState.categoryMenuIsVisible,
    }));
  }

  render() {
    let categoryMenu = null;

    if (this.state.categoryMenuIsVisible) {
      categoryMenu = <CategoryMenu />;
    }

    return (
      <nav>
        {categoryMenu}
        <CategoryButton toggleCategoryMenu={this.toggleCategoryMenu} />
        <Link to="/">Wheelmap</Link>
        <Link to="/about">About</Link>
        <Link to="/topics">Topics</Link>
      </nav>
    );
  }
}
