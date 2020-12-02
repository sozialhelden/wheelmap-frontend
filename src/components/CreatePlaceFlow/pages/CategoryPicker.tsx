import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import { ChromelessButton } from '../../Button';

import CategoryTreeNode, { HierarchicalCategoryEntry } from '../components/CategoryTreeNode';
import VerticalPage from '../components/VerticalPage';
import PageHeader from '../components/PageHeader';
import AppContext from '../../../AppContext';
import colors from '../../../lib/colors';

type Props = {
  className?: string,
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

    return ((Object.values(roots) as any) as HierarchicalCategoryEntry[]);
  }, [rawTreeData]);

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage className={props.className}>
      <PageHeader>
        <ChromelessButton onClick={onCancel}>{t`Back`}</ChromelessButton>
        <h2>{t`Select Category`}</h2>
      </PageHeader>
      <ol>
        {hierarchicalCategoryTree.map(entry => {
          return <CategoryTreeNode key={entry._id} node={entry} onSelected={onSelected} />;
        })}
      </ol>
    </VerticalPage>
  );
};

export default styled(CategoryPicker)`
  padding: 0px;

  > ${PageHeader} {
    padding: 24px;
  }

  > ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ${ChromelessButton} {
    font-weight: bold;
    color: ${colors.linkColor};
  }
`;
