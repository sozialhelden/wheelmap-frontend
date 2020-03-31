// @flow
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import type { Feature } from '../../../lib/Feature';
import type { SourceWithLicense } from '../../../app/PlaceDetailsProps';
import { PrimaryButton } from '../../Button';
import AppContext from '../../../AppContext';
import { Dots } from 'react-activity';
import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache';
import colors from '../../../lib/colors';

function hasKoboSubmission(feature: Feature) {
  if (feature.properties && feature.properties.ids) {
    for (const externalId of feature.properties.ids) {
      if (externalId.provider === 'koboSubmission') {
        return true;
      }
    }
  }
  return false;
}

type Props = {
  className?: string,
  featureId: string,
  feature: Feature,
  sources: SourceWithLicense[] | null,
};

type State = 'Idle' | 'CreatingLink' | 'Error';

const validLinkDuration = 1000 * 60 * 3; // 3 minutes

const EditFormSubmissionButton = (props: Props) => {
  const primarySource =
    props.sources && props.sources.length > 0 ? props.sources[0].source : undefined;
  const [state, setState] = React.useState<State>('Idle');
  const [error, setError] = React.useState<string | null>(null);
  const resolvedEditUrl = React.useRef<string | null>(null);

  const appContext = React.useContext(AppContext);
  const tokenString = appContext.app.tokenString;
  const placeId = props.featureId;

  const createOrOpenEditLink = React.useCallback(() => {
    if (resolvedEditUrl.current) {
      window.open(resolvedEditUrl.current, '_blank');
      return;
    }

    setState('CreatingLink');
    accessibilityCloudFeatureCache
      .getEditPlaceSubmissionUrl(placeId, 'false', tokenString)
      .then(uri => {
        console.log(uri);
        resolvedEditUrl.current = uri;
        setState('Idle');
        setTimeout(() => (resolvedEditUrl.current = null), validLinkDuration);
        window.open(uri, '_blank');
      })
      .catch(error => {
        setState('Error');
        resolvedEditUrl.current = null;
        setError(typeof error === 'object' ? error.reason : String(error));
      });
  }, [setState, setError, placeId, tokenString, resolvedEditUrl]);

  const hasDefaultForm = primarySource && primarySource.defaultKoboForm;
  const hasSubmission = hasKoboSubmission(props.feature);
  const canEditSubmission = hasDefaultForm || hasSubmission;
  if (!canEditSubmission) {
    return null;
  }

  return (
    <section className={props.className}>
      <PrimaryButton disabled={state !== 'Idle'} onClick={createOrOpenEditLink}>
        {t`Add more details`}
        {state === 'CreatingLink' && <Dots className="loadingIndicator" color={'white'} />}
      </PrimaryButton>
      {state === 'Error' && (
        <div className="errorBlock">
          <p>{t`Something went wrong. Please retry later or contact an administrator.`}</p>
          <p>{error}</p>
        </div>
      )}
    </section>
  );
};

export default styled(EditFormSubmissionButton)`
  margin-top: 12px;

  .loadingIndicator {
    margin-left: 12px;
  }

  .errorBlock {
    background: ${colors.negativeColor};
    padding: 12px;
    color: white;
    border-radius: 4px;
    margin-top: 4px;
  }
`;
