// @flow

import React from 'react';
import styled from 'styled-components';

import CategoryButton from './CategoryButton';
import { isAccessibilityFiltered } from '../../lib/Feature';
import Categories from '../../lib/Categories';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

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
      .circle {
        height: 30px;
        width: 30px;
      }
      figure {
        width: 30px;
        height: 30px;
        svg.icon {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
`;

type Props = {
  onFocus: () => void,
  onCategorySelect: () => void,
  onCategoryReset: () => void,
  category: ?string,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
};

export default function CategoryMenu(props: Props) {
  let names = null;
  const { category, onCategoryReset, onCategorySelect } = props;

  if (category) {
    names = { [category]: Categories.translatedWheelmapRootCategoryName(category) };
  } else {
    names = Categories.getTranslatedRootCategoryNames();
  }

  const showCloseButton = Boolean(category);
  const onClick = category ? onCategoryReset : onCategorySelect;

  return (
    <Container className="category-menu">
      {Object.keys(names).map((category, index) => (
        <CategoryButton
          onClick={onClick}
          onFocus={props.onFocus}
          showCloseButton={showCloseButton}
          hasCircle={!showCloseButton && !isAccessibilityFiltered(props.accessibilityFilter)}
          accessibilityFilter={props.accessibilityFilter}
          toiletFilter={props.toiletFilter}
          key={category}
          className="category-button"
          name={names[category]}
          category={category}
        />
      ))}
    </Container>
  );
}
