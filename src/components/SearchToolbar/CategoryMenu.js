// @flow

import React from 'react';
import styled from 'styled-components';

import { Circle } from '../IconButton';
import CategoryButton from './CategoryButton';
import { isAccessibilityFiltered } from '../../lib/Feature';
import Categories from '../../lib/Categories';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

type Props = {
  onFocus: () => void,
  category: ?string,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  className?: string,
};

function CategoryMenu(props: Props) {
  let names = null;
  const { category } = props;

  if (category) {
    names = { [category]: Categories.translatedWheelmapRootCategoryName(category) };
  } else {
    names = Categories.getTranslatedRootCategoryNames();
  }

  const showCloseButton = Boolean(category);

  return (
    <div className={props.className}>
      {Object.keys(names).map((category, index) => (
        <CategoryButton
          onFocus={props.onFocus}
          showCloseButton={showCloseButton}
          hasCircle={!showCloseButton && !isAccessibilityFiltered(props.accessibilityFilter)}
          accessibilityFilter={props.accessibilityFilter}
          toiletFilter={props.toiletFilter}
          key={category}
          name={names[category]}
          category={category}
        />
      ))}
    </div>
  );
}

export default styled(CategoryMenu)`
  flex-flow: row wrap;
  display: flex;
  z-index: 1000;
  top: 50px;
  width: 100%;
  padding: 0;

  ${CategoryButton} {
    flex: 80px;

    @media (max-width: 512px) {
      flex: 60px;
    }

    @media (max-width: 320px) {
      flex: 50px;

      ${Circle} {
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
