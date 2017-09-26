// @flow

import { t } from '../../lib/i18n';
import React from 'react';
import styled from 'styled-components';
import CategoryButton from './CategoryButton';
import Categories from '../../lib/Categories';

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
  const names = Categories.getTranslatedRootCategoryNames();
  return (
    <Container className="category-menu">
      {Object.keys(names).map(id => (<CategoryButton
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        key={id}
        className="category-button"
        name={names[id]}
        id={id}
      />))}
    </Container>
  );
}
