// @flow

import * as React from 'react';
import { t } from 'ttag';

import SourceLink from '../SourceLink';
import type { Feature, AccessibilityCloudProperties } from '../../../lib/Feature';
import { type DataSource } from '../../../lib/cache/DataSourceCache';
import strings from './strings';
import { AppContextConsumer } from '../../../AppContext';

type Props = {
  feature: Feature,
  source: ?DataSource,
  onClose: (event: UIEvent) => void,
  properties: AccessibilityCloudProperties,
};

const callToActions = {
  // translator: View on external webpage link in report dialog.
  infoPageUrl: name => t`View this place on ${name}`,
  // translator: Edit on external webpage link in report dialog.
  editPageUrl: name => t`Edit this place on ${name}`,
};

const FixOnExternalPage = (props: Props) => {
  const { feature, source, properties, onClose } = props;
  if (!feature || !properties || !source) return null;
  const { useLinkExplanation, editingDelayExplanation, backButtonCaption } = strings();

  return (
    <section>
      {properties.infoPageUrl ? (
        <div>
          <p>{useLinkExplanation}</p>
          <p className="subtle">{editingDelayExplanation}</p>
          <AppContextConsumer>
            {appContext =>
              ['infoPageUrl', 'editPageUrl'].map(propertyName => (
                <SourceLink
                  key={propertyName}
                  properties={properties}
                  knownSourceNameCaption={callToActions[propertyName]}
                  propertyName={propertyName}
                  appToken={appContext.app.tokenString}
                />
              ))
            }
          </AppContextConsumer>
        </div>
      ) : null}
      <button className="link-button negative-button" onClick={onClose}>
        {backButtonCaption}
      </button>
    </section>
  );
};

export default FixOnExternalPage;
