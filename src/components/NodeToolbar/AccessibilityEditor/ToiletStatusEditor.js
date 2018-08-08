// @flow

import * as React from 'react';
import { t } from 'ttag';

import useImperialUnits from '../../../lib/useImperialUnits';
import { accessibleToiletDescription } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoUnknown } from '../../../lib/Feature';

import { saveToiletStatus } from './saveStatus';
import RadioStatusEditor from './RadioStatusEditor';
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible';
import ToiletStatusNotAccessibleIcon from '../../icons/accessibility/ToiletStatusNotAccessible';

type SaveOptions = {
  featureId: string;
  onSave: ?(value: YesNoUnknown) => void;
  onClose: () => void;
};

type Props = SaveOptions & {
  feature: WheelmapFeature // eslint-disable-line react/no-unused-prop-types
  ; className: string;
  presetStatus?: ?YesNoUnknown;
};

function AccessibleToiletDescription() {
  return <ul>
    {accessibleToiletDescription(useImperialUnits()).map(text => <li key={text}>{text}</li>)}
  </ul>;
}

export default function ToiletStatusEditor(props: Props) {
  // translator: Header for the toilet status prompt. Asks the user if the edited place’s toilet is wheelchair accessible.
  const headerText = t`Is the toilet here wheelchair accessible?`;

  const captions = {
    // translator: Caption for the ‘yes’ radio button (while marking toilet status)
    yes: t`Yes`,
    // translator: Caption for the ‘no’ radio button (while marking toilet status)
    no: t`No`
  };

  const descriptions = {
    yes: <AccessibleToiletDescription />,
    no: null
  };

  const icons = {
    yes: <ToiletStatusAccessibleIcon className="icon" />,
    no: <ToiletStatusNotAccessibleIcon className="icon" />
  };

  return <RadioStatusEditor {...props} undefinedStringValue="unknown" getValueFromFeature={feature => feature.properties.wheelchair_toilet} saveValue={value => saveToiletStatus({ ...props, value })} renderChildrenForValue={({ value, categoryId }) => icons[value]} shownStatusOptions={['yes', 'no']} captionForValue={value => captions[value]} descriptionForValue={value => descriptions[value]}>
    <header id="wheelchair-accessibility-header">{headerText}</header>
  </RadioStatusEditor>;
}