// @flow

import { t } from 'c-3po';
import React from 'react';
import styled from 'styled-components';
import CategoryButton from './CategoryButton';

const categories = {
  // translator: Main category
  shopping: t`Shopping`,
  // translator: Main category
  food: t`Food & Drinks`,
  // translator: Main category
  public_transfer: t`Transport`,
  // translator: Main category
  leisure: t`Leisure`,
  // translator: Main category
  accommodation: t`Hotels`,
  // translator: Main category
  tourism: t`Tourism`,
  // translator: Main category
  education: t`Education`,
  // translator: Main category
  government: t`Official`,
  // translator: Main category
  health: t`Health`,
  // translator: Main category
  money_post: t`Money`,
  // translator: Main category
  sport: t`Sport`,
  // translator: Main category
  misc: t`Misc`,
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


type Props = {
  onFocus: (() => void),
  onBlur: (() => void),
};


export default function CategoryMenu(props: Props) {
  return (
    <Container className="category-menu">
      {Object.keys(categories).map(id => (<CategoryButton
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        key={id}
        className="category-button"
        name={categories[id]}
        id={id}
      />))}
    </Container>
  );
}
