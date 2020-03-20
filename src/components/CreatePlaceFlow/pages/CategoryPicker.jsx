// @flow
import * as React from 'react';

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
    <>
      CategoryPicker
      <button onClick={onCancel}>Cancel</button>
      <li>
        <button onClick={() => onSelected('test')}>First category</button>
      </li>
    </>
  );
};

export default CategoryPicker;
