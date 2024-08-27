import * as React from 'react'
import { t } from 'ttag'

import { PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson'
import SourceLink, {
  PropertyName,
} from '../../CombinedFeaturePanel/components/IconButtonList/SourceLink'
import { DataSource } from '../../../lib/cache/DataSourceCache'
import strings from './strings'
import { AppContextConsumer } from '../../../AppContext'

type Props = {
  feature: PlaceInfo;
  source: DataSource | null;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  properties: PlaceProperties;
};

const callToActions: { [key in PropertyName]: (v: string) => string } = {
  // translator: View on external webpage link in report dialog.
  infoPageUrl: (name: string) => t`View this place on ${name}`,
  // translator: Edit on external webpage link in report dialog.
  editPageUrl: (name: string) => t`Edit this place on ${name}`,
}

function FixOnExternalPage(props: Props) {
  const {
    feature, source, properties, onClose,
  } = props
  if (!feature || !properties || !source) return null
  const {
    useLinkExplanation,
    editingDelayExplanation,
    backButtonCaption,
  } = strings()

  return (
    <section>
      {properties.infoPageUrl ? (
        <div>
          <p>{useLinkExplanation}</p>
          <p className="subtle">{editingDelayExplanation}</p>
          <AppContextConsumer>
            {(appContext) => [
              'infoPageUrl',
              'editPageUrl',
            ].map((propertyName: PropertyName) => (
              <SourceLink
                key={propertyName}
                properties={properties}
                knownSourceNameCaption={callToActions[propertyName]}
                propertyName={propertyName}
                appToken={appContext.app.tokenString}
              />
            ))}
          </AppContextConsumer>
        </div>
      ) : null}
      <button className="link-button negative-button" onClick={onClose}>
        {backButtonCaption}
      </button>
    </section>
  )
}

export default FixOnExternalPage
