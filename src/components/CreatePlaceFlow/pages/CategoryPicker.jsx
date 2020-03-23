// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';
import AppContext from '../../../AppContext';

import type { ACCategory } from '../../../lib/Categories';

type CategoryTreeLeafProps = {
  className?: String,
  category: ACCategory,
  onSelected: (categoryId: string) => void,
};

const CategoryTreeLeaf = (props: CategoryTreeLeafProps) => {
  const { category, onSelected } = props;
  const id = category._id;

  const selectEntry = React.useCallback(() => onSelected(id), [id, onSelected]);

  return <button onClick={selectEntry}>{id}</button>;
};

type HierarchicalCategoryEntry = ACCategory & {
  children: ACCategory[],
};

type CategoryTreeRootProps = {
  className?: String,
  node: HierarchicalCategoryEntry,
  onSelected: (categoryId: string) => void,
};

const CategoryTreeRoot = (props: CategoryTreeRootProps) => {
  const { node, onSelected } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);
  const toggleExpanded = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  return (
    <li>
      <header>
        {node._id}
        <button onClick={toggleExpanded}>{expanded ? 'v' : '>'}</button>
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

type Props = {
  className?: String,
  visible: boolean,
  onCancel: () => void,
  onSelected: (categoryId: string) => void,
};

const CategoryPicker = (props: Props) => {
  const { visible, onCancel, onSelected } = props;

  const { categories } = React.useContext(AppContext);
  const rawTreeData = categories.categoryTree;

  const hierarchicalCategoryTree = React.useMemo(() => {
    const roots = {};

    for (const acCategory of rawTreeData) {
      if (
        !acCategory.parentIds ||
        acCategory.parentIds.length === 0 ||
        (acCategory.parentIds.length === 1 && acCategory.parentIds[0] === null)
      ) {
        const children = roots[acCategory._id] ? roots[acCategory._id].children : [];
        roots[acCategory._id] = { ...acCategory, children: [acCategory, ...children] };
      } else {
        for (const parentId of acCategory.parentIds) {
          if (!roots[parentId]) {
            roots[parentId] = { children: [] };
          } else {
            roots[parentId].children.push(acCategory);
          }
        }
      }
    }

    return ((Object.values(roots): any): HierarchicalCategoryEntry[]);
  }, [rawTreeData]);

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage className={props.className}>
      CategoryPicker
      <button onClick={onCancel}>Cancel</button>
      <ol>
        {hierarchicalCategoryTree.map(entry => {
          return <CategoryTreeRoot key={entry._id} node={entry} onSelected={onSelected} />;
        })}
      </ol>
    </VerticalPage>
  );
};

export default CategoryPicker;
