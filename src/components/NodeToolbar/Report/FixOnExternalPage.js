// @flow

import * as React from 'react';
import { t } from 'ttag';

import SourceLink from '../SourceLink';
import type { Feature, AccessibilityCloudProperties } from '../../../lib/Feature';
import { type DataSource } from '../../../lib/cache/DataSourceCache';
import strings from './strings';

type Props = {
  feature: Feature,
  source: ?DataSource,
  onClose: (event: UIEvent) => void,
  properties: AccessibilityCloudProperties,
};

type State = {
  sourceName: ?string,
};

const callToActions = {
  // translator: View on external webpage link in report dialog.
  infoPageUrl: name => t`View this place on ${name}`,
  // translator: Edit on external webpage link in report dialog.
  editPageUrl: name => t`Edit this place on ${name}`,
};

class FixOnExternalPage extends React.Component<Props, State> {
  props: Props;

  render() {
    const { feature, source, properties } = this.props;

    if (!feature || !properties || !source) return null;

    const { useLinkExplanation, editingDelayExplanation, backButtonCaption } = strings();

    return (
      <section>
        {properties.infoPageUrl ? (
          <div>
            <p>{useLinkExplanation}</p>
            <p className="subtle">{editingDelayExplanation}</p>
            {['infoPageUrl', 'editPageUrl'].map(propertyName => (
              <SourceLink
                key={propertyName}
                properties={properties}
                knownSourceNameCaption={callToActions[propertyName]}
                propertyName={propertyName}
              />
            ))}
          </div>
        ) : null}
        <button className="link-button negative-button" onClick={this.props.onClose}>
          {backButtonCaption}
        </button>
      </section>
    );
  }
}

export default FixOnExternalPage;
