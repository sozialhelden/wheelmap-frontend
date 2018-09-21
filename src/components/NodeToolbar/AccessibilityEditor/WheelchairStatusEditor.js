// @flow

import { t } from 'ttag';
import * as React from 'react';

import { accessibilityDescription, shortAccessibilityName } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoLimitedUnknown } from '../../../lib/Feature';
import { saveWheelchairStatus } from './saveStatus';
import RadioStatusEditor from './RadioStatusEditor';
import Icon from '../../Icon';

type SaveOptions = {
  featureId: string | number,
  onSave: ?(value: YesNoLimitedUnknown) => void,
  onClose: () => void,
};

type Props = SaveOptions & {
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className?: string,
  presetStatus?: ?YesNoLimitedUnknown,
};

export default function WheelchairStatusEditor(props: Props) {
  return (
    <RadioStatusEditor
      {...props}
      undefinedStringValue="unknown"
      getValueFromFeature={feature => feature.properties.wheelchair}
      saveValue={value => saveWheelchairStatus({ ...props, value })}
      renderChildrenForValue={({ value, categoryId }) => (
        <Icon
          accessibility={value}
          category={categoryId}
          size="medium"
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
  );
}
