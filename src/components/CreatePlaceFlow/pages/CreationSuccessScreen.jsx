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
  state: 'Submitting' | 'Error' | 'Success',
  onSubmit: () => void,
  onRetry: () => void,
};

const CreationSuccessScreen = (props: Props) => {
  const { className, placeName, visible, state, onSubmit, onRetry } = props;

  const appContext = React.useContext(AppContext);
  const appName = appContext.app.name;

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage className={className}>
      {state === 'Submitting' && (
        <>
          <Dots size={30} color={'rgba(0, 0, 0, 0.4)'} />
          <h2>{t`Thank you!`}</h2>
          <p>{t`Uploading ${placeName} to ${appName}.`}</p>
        </>
      )}
      {state === 'Error' && (
        <>
          <span role="img" aria-label={t`Unhappy face`}>
            😫
          </span>
          <h2>{t`Sorry`}</h2>
          <p>{t`Something went wrong while uploading ${placeName} to ${appName}.`}</p>
          <PrimaryButton onClick={onRetry}>{t`Retry`}</PrimaryButton>
        </>
      )}
      {state === 'Success' && (
        <>
          <span role="img" aria-label={t`Clapping hands`}>
            👏🏽
          </span>
          <h2>{t`You rock!`}</h2>
          <p>{t`${placeName} was added to ${appName}.`}</p>
          <PrimaryButton onClick={onSubmit}>{t`Continue to place`}</PrimaryButton>
        </>
      )}
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
