import { t } from 'ttag';
import * as React from 'react';

import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import { saveWheelchairStatus } from './saveStatus';
import RadioStatusEditor from './RadioStatusEditor';
import Icon from '../../Icon';
import { CategoryLookupTables } from '../../../lib/Categories';
import { isOnSmallViewport } from '../../../lib/ViewportSize';
import { AppContextConsumer } from '../../../AppContext';

type SaveOptions = {
  featureId: string,
  onSave: (value: YesNoLimitedUnknown) => void | null,
  onClose: () => void,
};

type Props = SaveOptions & {
  categories: CategoryLookupTables,
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className?: string,
  presetStatus?: YesNoLimitedUnknown | null,
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
          saveValue={(value: YesNoLimitedUnknown) => saveWheelchairStatus({ ...props, appContext, value })}
          renderChildrenForValue={({ value, categoryId }: { value: YesNoLimitedUnknown, categoryId: string }) => (
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
          captionForValue={(value: YesNoLimitedUnknown) => shortAccessibilityName(value)}
          descriptionForValue={(value: YesNoLimitedUnknown) => accessibilityDescription(value)}
        >
          <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>
        </RadioStatusEditor>
      )}
    </AppContextConsumer>
  );
}
