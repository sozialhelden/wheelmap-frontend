// @flow
import * as React from 'react';
import { t } from 'ttag';
import { Dots } from 'react-activity';
import styled from 'styled-components';

import VerticalPage from '../components/VerticalPage';
import AppContext from '../../../AppContext';
import { PrimaryButton } from '../../Button';

type Props = {
  visible: boolean,
  className?: string,
  placeName: string,
  onSubmit: () => void,
};

const CreationSuccessScreen = (props: Props) => {
  const { className, visible, onSubmit } = props;

  const appContext = React.useContext(AppContext);

  const placeName = props.placeName || 'Some place';
  const appName = appContext.app.name;

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage className={className}>
      <>
        <span role="img" aria-label={t`Clapping hands`}>
          👏
        </span>
        <h2>{t`You rock!`}</h2>
        <p>{t`${placeName} was added to ${appName}.`}</p>
        <PrimaryButton onClick={onSubmit}>{t`Continue to place`}</PrimaryButton>
      </>
    </VerticalPage>
  );
};
export default styled(CreationSuccessScreen)`
  height: 100%;
  align-items: center;
  justify-content: center;

  > span {
    font-size: 60px;
  }

  & > ${PrimaryButton} {
    margin-top: 48px;
  }
`;
