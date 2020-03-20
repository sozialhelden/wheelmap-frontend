// @flow
import * as React from 'react';

type Props = {
  visible: boolean,
  onSubmit: () => void,
};

const CreationSuccessScreen = (props: Props) => {
  const { visible, onSubmit } = props;

  if (!visible) {
    return null;
  }

  return (
    <>
      CreationSuccessScreen
      <button onClick={onSubmit}>Done</button>
    </>
  );
};

export default CreationSuccessScreen;
