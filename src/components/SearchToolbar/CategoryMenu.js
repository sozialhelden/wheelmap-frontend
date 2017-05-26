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
`;


export default class CategoryMenu extends Component {
  render() {
    return (
      <Container>
        {Object.keys(categories).map(id => <CategoryButton key={id} name={categories[id]} id={id} />)}
      </Container>
    );
  }
}
