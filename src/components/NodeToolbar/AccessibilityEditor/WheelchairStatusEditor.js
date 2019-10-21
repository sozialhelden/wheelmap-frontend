// @flow

import { t } from 'ttag';
import * as React from 'react';

import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import { saveWheelchairStatus } from './saveStatus';
import RadioStatusEditor from './RadioStatusEditor';
import Icon from '../../Icon';
import { type CategoryLookupTables } from '../../../lib/Categories';
import { isOnSmallViewport } from '../../../lib/ViewportSize';
import { AppContextConsumer } from '../../../AppContext';

type SaveOptions = {
  featureId: string,
  onSave: ?(value: YesNoLimitedUnknown) => void,
  onClose: () => void,
};

type Props = SaveOptions & {
  categories: CategoryLookupTables,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className?: string,
  presetStatus?: ?YesNoLimitedUnknown,
};

export default function WheelchairStatusEditor(props: Props) {
  return (
    <AppContextConsumer>
      {appContext => (
        <RadioStatusEditor
          {...props}
          hideUnselectedCaptions={true}
          undefinedStringValue="unknown"
          getValueFromFeature={feature => feature.properties.wheelchair}
          saveValue={value => saveWheelchairStatus({ ...props, appContext, value })}
          renderChildrenForValue={({ value, categoryId }) => (
            <Icon
              accessibility={value}
              category={categoryId}
              size={isOnSmallViewport() ? 'small' : 'medium'}
              withArrow
              shadowed
              centered
            />
          )}
          shownStatusOptions={['yes', 'limited', 'no']}
          captionForValue={value => shortAccessibilityName(value)}
          descriptionForValue={value => accessibilityDescription(value)}
        >
          <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>
        </RadioStatusEditor>
      )}
    </AppContextConsumer>
  );
}
