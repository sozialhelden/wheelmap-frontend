import map from 'lodash/map';
import styled from 'styled-components';

import Categories from '../../lib/Categories';
import { isAccessibilityFiltered, YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { Circle } from '../IconButton';
import CategoryButton from './CategoryButton';

type Props = {
  onFocus: () => void,
  onBlur: () => void,
  category: string | null,
  accessibilityFilter?: YesNoLimitedUnknown[],
  toiletFilter?: YesNoUnknown[],
  className?: string,
};

function CategoryMenu(props: Props) {
  const { category } = props;

  let rootCategories = Categories.getRootCategories();

  if (category) {
    rootCategories = { [category]: rootCategories[category] };
  }

  const showCloseButton = Boolean(category);

  return (
    <div className={props.className}>
      {map(rootCategories, (category, categoryId) => (
        <CategoryButton
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          showCloseButton={showCloseButton}
          hasCircle={!showCloseButton && !isAccessibilityFiltered(props.accessibilityFilter)}
          accessibilityFilter={props.accessibilityFilter}
          toiletFilter={props.toiletFilter}
          key={categoryId}
          name={category.name}
          isMainCategory={!category.isSubCategory}
          category={categoryId}
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

    @media (max-width: 375px) {
      flex: 50px;

      ${Circle} {
        height: 26px;
        width: 26px;
      }

      figure {
        width: 26px;
        height: 26px;

        svg.icon {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
`;
