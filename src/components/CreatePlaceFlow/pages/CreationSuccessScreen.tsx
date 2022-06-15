import * as React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import VerticalPage from '../components/VerticalPage';
import AppContext from '../../../AppContext';
import { ChromelessButton, PrimaryButton } from '../../Button';
import usePlaceDetails from '../components/usePlaceDetails';
import Spinner from '../../ActivityIndicator/Spinner';

type Props = {
  visible: boolean;
  className?: string;
  placeId: string | null;
  placeName: string;
  state: 'Submitting' | 'Error' | 'Success';
  onSubmit: () => void;
  onRetry: () => void;
  onDismiss: () => void;
};

const CreationSuccessScreen = (props: Props) => {
  const { className, placeId, placeName, visible, state, onSubmit, onRetry, onDismiss } = props;

  const appContext = React.useContext(AppContext);
  const [, place, setPlaceId] = usePlaceDetails(placeId);
  const appName = appContext.app.name;
  React.useEffect(() => {
    setPlaceId(placeId);
  }, [setPlaceId, placeId]);

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage className={className}>
      {state === 'Submitting' && (
        <>
          <Spinner size={30} color={'rgba(0, 0, 0, 0.4)'} />
          <h2>{t`Thank you!`}</h2>
          <p>{t`Uploading ${placeName} to ${appName}.`}</p>
          <ChromelessButton onClick={onDismiss}>{t`Dismiss`}</ChromelessButton>
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

  > p {
    margin-bottom: 48px;
  }

  & > ${PrimaryButton} {
    margin-top: 12px;
  }
`;
