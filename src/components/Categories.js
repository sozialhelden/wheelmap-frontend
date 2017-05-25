import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { humanize } from 'underscore.string';
import styled from 'styled-components';

const categories = [
  'education',
  'accommodation',
  'food',
  'government',
  'health',
  'leisure',
  'misc',
  'money_post',
  'public_transfer',
  'shopping',
  'sport',
  'tourism',
  // 'unknown',
];

export class Category extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  render() {
    const name = this.props.name;
    const humanizedName = humanize(name);
    const url = `/categories/${name}`;

    return (
      <StyledLink activeClassName='active' to={url}>
        <StyledButtonIcon
          src={`${process.env.PUBLIC_URL}/icons/main-categories/${name}.svg`}
          alt={`${name}-icon`}
        />
        <span>{humanizedName}</span>
      </StyledLink>
    );
  }
}

const StyledButtonIcon = styled.img`
  width: 46px;
`;

// ^ add in later when supporting button icons as svg components
// height: 46px;
// fill: #2d2d2d;

const StyledLink = styled(NavLink)`
  display: inline-flex;
  flex-basis: 50%;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 20px 0 10px 0;

  font-size: 16px;
  text-decoration: none;
  color: #2d2d2d;

  border-bottom: 1px solid #eee;

  &:nth-child(even) {
    border-left: 1px solid #eee;
  }

  &:hover {
    background-color: #eee;
  }
`;

const Container = styled.div`
  flex-flow: row wrap;
  display: flex;
  z-index: 1000;
  top: 50px;
  width: 320px;
  font-size: 18px;
  background-color: white;
`;

export class CategoryMenu extends Component {
  render() {
    return (
      <Container>
        {categories.map(name => <Category name={name} key={name} />)}
      </Container>
    );
  }
}

const StyledButton = styled.button`
  height: 30px;
  font-size: 18px;
  border: none;
  border-radius: 20px;
  padding: 0 11px;
  background-color: #8ab648;
  color: #eee;
  cursor: pointer;

  &:hover {
    background-color: #79a03e;
  }

  &:active {
    background-color: #688935;
  }
`;

export const CategoryButton = props => (
  <StyledButton onClick={props.toggleCategoryMenu}>
    Categories
  </StyledButton>
);

CategoryButton.propTypes = {
  toggleCategoryMenu: React.PropTypes.func,
};
