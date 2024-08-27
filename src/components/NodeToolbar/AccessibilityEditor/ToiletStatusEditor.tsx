import { t } from 'ttag'

import {
  AccessibilityCloudFeature, accessibleToiletDescription,
  hasAccessibleToilet, WheelmapFeature,
  YesNoUnknown,
} from '../../../lib/Feature'
import shouldPreferImperialUnits from '../../../lib/model/geo/shouldPreferImperialUnits'

import { AppContextConsumer } from '../../../AppContext'
import { CategoryLookupTables } from '../../../lib/model/ac/categories/Categories'
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible'
import ToiletStatusNotAccessibleIcon from '../../icons/accessibility/ToiletStatusNotAccessible'
import RadioStatusEditor from './RadioStatusEditor'
import { saveToiletStatus } from './saveStatus'

type SaveOptions = {
  featureId: string;
  onSave: (value: YesNoUnknown) => void | null;
  onClose: () => void;
};

type Props = SaveOptions & {
  categories: CategoryLookupTables;
  feature: WheelmapFeature | AccessibilityCloudFeature;
  className?: string;
  presetStatus?: YesNoUnknown | null;
};

function AccessibleToiletDescription() {
  return (
    <ul>
      {accessibleToiletDescription(shouldPreferImperialUnits()).map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  )
}

export default function ToiletStatusEditor(props: Props) {
  // translator: Header for the toilet status prompt. Asks the user if the edited place’s toilet is wheelchair accessible.
  const headerText = t`Is the toilet here wheelchair accessible?`

  const captions = {
    // translator: Caption for the ‘yes’ radio button (while marking toilet status)
    yes: t`Yes`,
    // translator: Caption for the ‘no’ radio button (while marking toilet status)
    no: t`No`,
  }

  const descriptions = {
    yes: <AccessibleToiletDescription />,
    no: null,
  }

  const icons = {
    yes: <ToiletStatusAccessibleIcon className="icon" />,
    no: <ToiletStatusNotAccessibleIcon className="icon" />,
  }

  return (
    <AppContextConsumer>
      {(appContext) => (
        <RadioStatusEditor
          {...props}
          undefinedStringValue="unknown"
          getValueFromFeature={(feature) => hasAccessibleToilet(feature.properties)}
          saveValue={(value) => saveToiletStatus({
            ...props,
            appContext,
            value: value as YesNoUnknown,
          })}
          renderChildrenForValue={({ value, categoryId }) => (
            <>
              {icons[value]}
&nbsp;
            </>
          )}
          shownStatusOptions={['yes', 'no']}
          captionForValue={(value) => captions[value]}
          descriptionForValue={(value) => descriptions[value]}
        >
          <header id="wheelchair-accessibility-header">{headerText}</header>
        </RadioStatusEditor>
      )}
    </AppContextConsumer>
  )
}
