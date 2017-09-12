import styled from 'styled-components';
import React, { Component } from 'react';
import CategoryButton from './CategoryButton';

const categories = {
  shopping: 'Shopping',
  food: 'Food & Drinks',
  public_transfer: 'Transport',
  leisure: 'Leisure',
  accommodation: 'Hotels',
  tourism: 'Tourism',
  education: 'Education',
  government: 'Official',
  health: 'Health',
  money_post: 'Money',
  sport: 'Sport',
  misc: 'Misc',
  // 'unknown',
};

const Container = styled.div`
  flex-flow: row wrap;
  display: flex;
  z-index: 1000;
  top: 50px;
  width: 100%;
  margin-bottom: 10px;
  > * {
    flex: 65px;
  }
`;


export default class CategoryMenu extends Component {
  render() {
    return (
      <Container className="category-menu">
        {Object.keys(categories).map(id => <CategoryButton onFocus={this.props.onFocus} onBlur={this.props.onBlur} key={id} className="category-button" name={categories[id]} id={id} />)}
      </Container>
    );
  }
}
