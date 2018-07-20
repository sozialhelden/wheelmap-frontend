// @flow

import * as React from 'react';
import { t } from 'c-3po';

import useImperialUnits from '../../../lib/useImperialUnits';
import { accessibleToiletDescription } from '../../../lib/Feature';
import type { WheelmapFeature, YesNoUnknown } from '../../../lib/Feature';


import RadioStatusEditor from './RadioStatusEditor';
import { saveToiletStatus } from './saveStatus';
import Icon from '../../Icon';


type SaveOptions = {
  featureId: string,
  onSave: ?((YesNoUnknown) => void),
  onClose: (() => void)
};

type Props = SaveOptions & {
  feature: WheelmapFeature, // eslint-disable-line react/no-unused-prop-types
  className: string,
  presetStatus?: ?YesNoUnknown,
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
    no: t`No`,
  };

  const descriptions = {
    yes: <AccessibleToiletDescription />,
    no: null,
  };

  const icons = {

  };

  return <RadioStatusEditor
    {...props}
    undefinedStringValue="unknown"
    getValueFromFeature={feature => feature.properties.wheelchair_toilet}
    saveValue={(value) => saveToiletStatus({ ...props, value })}
    renderChildrenForValue={({ value, categoryId }) => <Icon accessibility={value} category={categoryId} size='medium' withArrow shadowed centered />}
    shownStatusOptions={['yes', 'no']}
    captionForValue={value => captions[value]}
    descriptionForValue={value => descriptions[value]}
  >
    <header id="wheelchair-accessibility-header">{headerText}</header>
  </RadioStatusEditor>;
}
