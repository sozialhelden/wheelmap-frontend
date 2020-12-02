import * as React from 'react';
import styled from 'styled-components';

import { ACCategory, categoryNameFor } from '../../../lib/Categories';
import colors from '../../../lib/colors';

import Icon from '../../Icon';
import ChevronRight from '../../icons/actions/ChevronRight';

import CategoryTreeLeaf from './CategoryTreeLeaf';

export type HierarchicalCategoryEntry = ACCategory & {
  children: ACCategory[],
};

type Props = {
  className?: string,
  node: HierarchicalCategoryEntry,
  onSelected: (categoryId: string) => void,
};

const CategoryTreeNode = (props: Props) => {
  const { className, node, onSelected } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);
  const toggleExpanded = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  return (
    <li className={className}>
      <header>
        <button onClick={toggleExpanded}>
          <Icon
            withArrow={false}
            category={node._id}
            ariaHidden={true}
            size="medium"
            accessibility={'yes'}
            backgroundColor={colors.darkLinkColor}
          />
          <span className="categoryName">{categoryNameFor(node) || node._id}</span>
          <ChevronRight className={`expandArrow ${expanded ? 'expanded' : 'collapsed'}`} />
        </button>
      </header>
      {expanded && (
        <ol>
          {node.children.map(category => {
            return (
              <CategoryTreeLeaf key={category._id} category={category} onSelected={onSelected} />
            );
          })}
        </ol>
      )}
    </li>
  );
};

export default styled(CategoryTreeNode)`
  width: 100%;

  > header {
    > button {
      width: 100%;
      appearance: none;
      height: 60px;
      border: 0;
      background: white;
      cursor: pointer;
      padding: 0 24px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid ${colors.textMuted};

      figure {
        display: inline-flex;
        margin-right: 12px;
      }

      .categoryName {
        font-weight: bold;
        text-align: left;
        flex: 1;
      }

      .expandArrow.expanded {
        transform: rotate(90deg);
      }

      &:hover {
        background: ${colors.selectedColorLight};
        > .categoryName {
          color: white;
        }
      }
    }
  }

  > ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;
