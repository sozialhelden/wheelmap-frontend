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
      <StyledLink to={url}>
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

const StyledLink = styled(Link)`
  display: inline-flex;
  flex-basis: 50%;
  flex-direction: column;
  align-items: center
  margin: 10px 0 10px 0;
  font-size: 16px;
  color: black;

  &:hover {
    background-color: #eee;
  }
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
