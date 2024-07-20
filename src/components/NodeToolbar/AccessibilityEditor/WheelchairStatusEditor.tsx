import { t } from 'ttag';

import { AppContextConsumer } from '../../../AppContext';
import { CategoryLookupTables } from '../../../lib/Categories';
import {
  AccessibilityCloudFeature,
  accessibilityDescription,
  isWheelchairAccessible,
  shortAccessibilityName,
  WheelmapFeature,
  wheelmapFeatureFrom,
  YesNoLimitedUnknown,
} from '../../../lib/Feature';
import { isBuildingLike } from '../../../lib/model/isBuildingLike';
import { isOnSmallViewport } from '../../../lib/ViewportSize';
import CategoryIcon from '../../Icon';
import RadioStatusEditor from './RadioStatusEditor';
import { saveWheelchairStatus } from './saveStatus';

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
  const wheelmapFeature = wheelmapFeatureFrom(props.feature);
  const showDescription = !wheelmapFeature || isBuildingLike(wheelmapFeature);
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
          descriptionForValue={(value: YesNoLimitedUnknown) => showDescription ? accessibilityDescription(value) : null}
        >
          <header id="wheelchair-accessibility-header">{t`How wheelchair accessible is this place?`}</header>
        </RadioStatusEditor>
      )}
    </AppContextConsumer>
  );
}
