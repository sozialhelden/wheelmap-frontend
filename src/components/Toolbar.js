import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {
  CategoryButton,
  CategoryMenu,
} from './Categories';

const StyledNavLink = styled(Link)`
  padding: 5px;
  text-decoration: none;
  color: #2d2d2d;

  &:hover {
    text-decoration: underline;
  }
`;

export default class Toolbar extends Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired,
  };

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
    return (
      <nav className={this.props.className}>
        <CSSTransitionGroup
          transitionName="sidebar"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.state.categoryMenuIsVisible ? <CategoryMenu /> : null}
        </CSSTransitionGroup>

        <CategoryButton toggleCategoryMenu={this.toggleCategoryMenu} />

        <StyledNavLink to="/">Wheelmap</StyledNavLink>
        <StyledNavLink to="/about">About</StyledNavLink>
        <StyledNavLink to="/topics">Topics</StyledNavLink>
      </nav>
    );
  }
}
