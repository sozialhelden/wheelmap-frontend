// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';

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
    <VerticalPage>
      CreationSuccessScreen
      <button onClick={onSubmit}>Done</button>
    </VerticalPage>
  );
};

export default CreationSuccessScreen;
