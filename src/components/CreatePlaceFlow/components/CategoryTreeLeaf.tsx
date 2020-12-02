// @flow
import * as React from 'react';
import styled from 'styled-components';

import { type ACCategory, categoryNameFor } from '../../../lib/Categories';
import colors from '../../../lib/colors';

import Icon from '../../Icon';

type Props = {
  className?: string,
  category: ACCategory,
  onSelected: (categoryId: string) => void,
};

const CategoryTreeLeaf = (props: Props) => {
  const { category, className, onSelected } = props;
  const id = category._id;

  const selectEntry = React.useCallback(() => onSelected(id), [id, onSelected]);

  return (
    <li className={className}>
      <button onClick={selectEntry}>
        <Icon
          withArrow={false}
          category={id}
          ariaHidden={true}
          size="medium"
          accessibility={'yes'}
          backgroundColor={colors.darkLinkColor}
        />
        <span>{categoryNameFor(category) || category._id}</span>
      </button>
    </li>
  );
};

export default styled(CategoryTreeLeaf)`
  & > button {
    width: 100%;
    appearance: none;
    height: 60px;
    border: 0;
    background: white;
    cursor: pointer;
    justify-content: flex-start;
    padding: 0 48px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${colors.textMuted};

    > figure {
      display: inline-flex;
      margin-right: 12px;
    }

    > span {
      font-weight: bold;
    }

    &:hover {
      background: ${colors.selectedColor};
      > span {
        color: white;
      }
    }
  }
`;
