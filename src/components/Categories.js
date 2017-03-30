import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
  'unknown',
];

export class Category extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  render() {
    const name = this.props.name;
    const humanizedName = humanize(name);
    const url = `categories/${name}`;

    return (
      <StyledLink to={url}>{humanizedName}</StyledLink>
    );
  }
}

const StyledLink = styled(Link)`
  display: inline-flex;
  flex-basis: 50%;
  margin: 10px 0 10px 0;
  font-size: 20px;
  color: black;
`;

const Container = styled.div`
  position: absolute;
  flex-flow: row wrap;
  display: flex;
  z-index: 1000;
  top: 0px;
  left: 0px;
  width: 400px;
  padding: 20px;
  color: black;
  font-size: 20px;
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
  margin: 20px;
`;

export const CategoryButton = props => (
  <StyledButton onClick={props.toggleCategoryMenu}>
    Categories
  </StyledButton>
);

CategoryButton.propTypes = {
  toggleCategoryMenu: React.PropTypes.func,
};
