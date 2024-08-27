import { t } from 'ttag'

import { AppContextConsumer } from '../../../AppContext'
import {
  AccessibilityCloudFeature,
  WheelmapFeature,
  YesNoLimitedUnknown,
  accessibilityDescription,
  isWheelchairAccessible,
  shortAccessibilityName,
} from '../../../lib/Feature'
import { CategoryLookupTables } from '../../../lib/model/ac/categories/Categories'
import { isOnSmallViewport } from '../../../lib/util/ViewportSize'
import Icon from '../../Icon'
import RadioStatusEditor from './RadioStatusEditor'
import { saveWheelchairStatus } from './saveStatus'

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
      {(appContext) => (
        <RadioStatusEditor
          {...props}
          hideUnselectedCaptions
          undefinedStringValue="unknown"
          getValueFromFeature={(feature) => isWheelchairAccessible(feature.properties)}
          saveValue={(value) => saveWheelchairStatus({
            ...props,
            appContext,
            value: value as YesNoLimitedUnknown,
          })}
          renderChildrenForValue={({ value, categoryId }) => (
            <Icon
              accessibility={value as YesNoLimitedUnknown}
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
  )
}
