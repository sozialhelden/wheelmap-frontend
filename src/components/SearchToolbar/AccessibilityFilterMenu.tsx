import { t } from 'ttag';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';

import colors from '../../lib/colors';
import AccessibilityFilterButton from './AccessibilityFilterButton';
import { PlaceFilter } from './AccessibilityFilterModel';
import { YesNoLimitedUnknown } from '../../lib/Feature';
import { yesNoUnknownArray } from '../../lib/Feature';
import AppContext from '../../AppContext';
import { translatedStringFromObject } from '../../lib/i18n';

type Props = PlaceFilter & {
  className?: string,
  hidden?: boolean,
  onCloseClicked?: () => void,
  onBlur: () => void,
  onButtonClick: (data: PlaceFilter) => void,
  category: string,
  accessibilities?: YesNoLimitedUnknown[],
};

function getAvailableFilters() {
  return {
    // all: {
    //   // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see', plural
    //   caption: t`All`,
    //   accessibilityFilter: ['yes', 'limited', 'no', 'unknown'],
    //   toiletFilter: [],
    // },
    partiallyAccessiblePlaces: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Partially wheelchair accessible`,
      accessibilityFilter: ['yes', 'limited'],
      toiletFilter: [],
    },
    partiallyAccessiblePlacesWithAccessibleWC: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Partially accessible with accessible WC`,
      accessibilityFilter: ['yes', 'limited'],
      isVisible: (category: string) => category !== 'toilets',
      toiletFilter: ['yes'],
    },
    onlyFullyAccessiblePlaces: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Only fully wheelchair accessible`,
      accessibilityFilter: ['yes'],
      toiletFilter: [],
    },
    onlyFullyAccessiblePlacesWithAccessibleWC: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Only fully accessible with accessible WC`,
      accessibilityFilter: ['yes'],
      isVisible: (category: string) => category !== 'toilets',
      toiletFilter: ['yes'],
    },
    placesWithMissingAccessibilityInfo: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Places that I can contribute information to`,
      accessibilityFilter: ['unknown'],
      toiletFilter: [],
    },
    inaccessiblePlaces: {
      // translator: Checkbox caption on the filter toolbar. If the checkbox is clicked, only places that are not wheelchair accessible are shown.
      caption: t`Only places that are not accessible`,
      accessibilityFilter: ['no'],
      toiletFilter: [],
    },
  };
}

function findFilterKey({ toiletFilter, accessibilityFilter }) {
  const availableFilters = getAvailableFilters();
  return Object.keys(availableFilters).find(key => {
    const filter = availableFilters[key];
    const requestedToiletFilter = isEqual(toiletFilter, yesNoUnknownArray) ? [] : toiletFilter;
    return (
      isEqual(requestedToiletFilter, filter.toiletFilter) &&
      isEqual(accessibilityFilter.sort(), filter.accessibilityFilter.sort())
    );
  });
}

function AccessibilityFilterMenu(props: Props) {
  const appContext = React.useContext(AppContext);
  const disableGrayPlacesFilter = appContext.app?.clientSideConfiguration?.disableGrayPlacesFilter;
  const availableFilters = getAvailableFilters();
  if (disableGrayPlacesFilter) {
    delete availableFilters.placesWithMissingAccessibilityInfo;
  }
  const { accessibilityFilter, toiletFilter, onButtonClick } = props;
  const category = props.category || 'undefined';
  const currentFilterKey = findFilterKey({ accessibilityFilter, toiletFilter });
  const shownFilterKeys = currentFilterKey ? [currentFilterKey] : Object.keys(availableFilters);

  return (
    <section className={props.className} aria-label={t`Wheelchair accessibility filter`}>
      {shownFilterKeys.map(key => {
        const filterDefinition = availableFilters[key];

        if (typeof filterDefinition.isVisible === 'function' && !filterDefinition.isVisible(category)) {
          return null;
        }

        const customizedLocalizedCaption = appContext.app.clientSideConfiguration?.textContent?.filterNames?.[key];
        const caption = translatedStringFromObject(customizedLocalizedCaption) || filterDefinition.caption;

        return (
          <AccessibilityFilterButton
            accessibilityFilter={[...filterDefinition.accessibilityFilter].sort()}
            toiletFilter={filterDefinition.toiletFilter}
            caption={caption}
            category={category}
            isMainCategory
            isActive={Boolean(currentFilterKey)}
            showCloseButton={shownFilterKeys.length === 1}
            onClick={onButtonClick}
            key={key}
          />
        );
      })}
    </section>
  );
}

const StyledAccessibilityFilterMenu = styled(AccessibilityFilterMenu)`
  border-top: 1px solid ${colors.borderColor};

  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    padding-right: 20px; /* For close icon */
  }

  section {
    opacity: 1;
    overflow: hidden;
    transition: opacity 0.1s ease-out, max-height 0.1s ease-out;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    &.section-hidden {
      max-height: 0;
      opacity: 0;
    }
  }

  .radio-button.focus-visible {
    border-radius: 100%;
    box-shadow: 0px 0px 0px 2px #4469e1;
  }

  .close-icon {
    margin-left: 1em;
  }
`;

export default StyledAccessibilityFilterMenu;
