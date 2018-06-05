// @flow

import React from 'react';
import styled from 'styled-components';
import CategoryButton from './CategoryButton';
import { isFiltered } from '../../lib/Feature';
import Categories, { translatedRootCategoryNames } from '../../lib/Categories';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import type { RouterHistory } from 'react-router-dom';

const Container = styled.div`
  flex-flow: row wrap;
  display: flex;
  z-index: 1000;
  top: 50px;
  width: 100%;
  padding: 0;
  > .category-button {
    flex: 80px;
    @media (max-width: 512px) {
      flex: 60px;
    }
    @media (max-width: 320px) {
      flex: 50px;
      figure {
        width: 30px;
        height: 30px;
      }
    }
  }
`;


type Props = {
  hidden: boolean,
  onFocus: (() => void),
  onBlur: (() => void),
  category: ?$Keys<typeof translatedRootCategoryNames>,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  history: RouterHistory,
};


export default function CategoryMenu(props: Props) {
  const names = props.category ? { [props.category]: Categories.translatedWheelmapRootCategoryName(props.category) } : translatedRootCategoryNames;
  const lastIndex = Object.keys(names).length - 1;

  return (
    <Container className="category-menu">
      {Object.keys(names).map((id, index) => (<CategoryButton
        hidden={props.hidden}
        history={props.history}
        onFocus={props.onFocus}
        showCloseButton={Boolean(props.category)}
        hasCircle={!isFiltered(props.accessibilityFilter)}
        accessibilityFilter={props.accessibilityFilter}
        toiletFilter={props.toiletFilter}
        onKeyDown={({nativeEvent}) => {
          const tabPressedOnLastButton = index === lastIndex && nativeEvent.key === 'Tab' && !nativeEvent.shiftKey;
          const shiftTabPressedOnFirstButton = index === 0 && nativeEvent.key === 'Tab' && nativeEvent.shiftKey;
          if(tabPressedOnLastButton || shiftTabPressedOnFirstButton) {
            props.onBlur();
          }
        }}
        key={id}
        className="category-button"
        name={names[id]}
        id={id}
      />))}
    </Container>
  );
}
