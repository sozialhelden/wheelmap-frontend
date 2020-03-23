// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';

type Props = {
  visible: boolean,
  onCancel: () => void,
  onSelected: (category: string) => void,
};

const CategoryPicker = (props: Props) => {
  const { visible, onCancel, onSelected } = props;

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage>
      CategoryPicker
      <button onClick={onCancel}>Cancel</button>
      <li>
        <button onClick={() => onSelected('test')}>First category</button>
      </li>
    </VerticalPage>
  );
};

export default CategoryPicker;
