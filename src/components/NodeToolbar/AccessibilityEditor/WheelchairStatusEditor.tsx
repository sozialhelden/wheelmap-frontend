import { t } from 'ttag';
import * as React from 'react';

import {
  AccessibilityCloudFeature,
  WheelmapFeature,
  YesNoLimitedUnknown,
} from '../../../lib/Feature';
import {
  accessibilityDescription,
  shortAccessibilityName,
  isWheelchairAccessible,
} from '../../../lib/Feature';
import { saveWheelchairStatus } from './saveStatus';
import RadioStatusEditor from './RadioStatusEditor';
import CategoryIcon from '../../Icon';
import { CategoryLookupTables } from '../../../lib/Categories';
import { isOnSmallViewport } from '../../../lib/ViewportSize';
import { AppContextConsumer } from '../../../AppContext';

type SaveOptions = {
  featureId: string;
  onSave: (value: YesNoLimitedUnknown) => void | null;
  onClose: () => void;
};

type Props = SaveOptions & {
  categories: CategoryLookupTables;
  feature: WheelmapFeature | AccessibilityCloudFeature;
  className?: string;
  presetStatus?: YesNoLimitedUnknown | null;
};

export default function WheelchairStatusEditor(props: Props) {
  return (
    <AppContextConsumer>
      {appContext => (
        <RadioStatusEditor
          {...props}
          hideUnselectedCaptions={true}
          undefinedStringValue="unknown"
          getValueFromFeature={feature => isWheelchairAccessible(feature.properties)}
          saveValue={value =>
            saveWheelchairStatus({ ...props, appContext, value: value as YesNoLimitedUnknown })
          }
          renderChildrenForValue={({ value, categoryId }) => (
            <CategoryIcon
              accessibility={value as YesNoLimitedUnknown}
              category={categoryId}
              size={isOnSmallViewport() ? 'small' : 'medium'}
              withArrow
              shadowed
              centered
            />
          )}
          shownStatusOptions={['yes', 'limited', 'no']}
          captionForValue={(value: YesNoLimitedUnknown) =>
            shortAccessibilityName(value, appContext.app.clientSideConfiguration)
          }
          descriptionForValue={(value: YesNoLimitedUnknown) => accessibilityDescription(value)}
        >
          <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>
        </RadioStatusEditor>
      )}
    </AppContextConsumer>
  );
}
