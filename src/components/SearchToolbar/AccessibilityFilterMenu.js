// @flow

import { t } from 'ttag';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import colors from '../../lib/colors';
import AccessibilityFilterButton from './AccessibilityFilterButton';
import type { PlaceFilter } from './AccessibilityFilterModel';
import type { YesNoLimitedUnknown } from '../../lib/Feature';
import { yesNoUnknownArray } from '../../lib/Feature';

type Props = PlaceFilter & {
  history: RouterHistory,
  className: string,
  hidden: boolean,
  onCloseClicked: () => void,
  onBlur: () => void,
  onFilterChanged: (filter: PlaceFilter) => void,
  category: string,
  accessibilities: YesNoLimitedUnknown[],
};

function getAvailableFilters() {
  return {
    // all: {
    //   // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see', plural
    //   caption: t`All`,
    //   accessibilityFilter: ['yes', 'limited', 'no', 'unknown'],
    //   toiletFilter: [],
    // },
    atLeastPartial: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Partially wheelchair accessible`,
      accessibilityFilter: ['yes', 'limited'],
      toiletFilter: [],
    },
    atLeastPartialWithWC: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Partially accessible with accessible WC`,
      accessibilityFilter: ['yes', 'limited'],
      toiletFilter: ['yes'],
    },
    fully: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Only fully wheelchair accessible`,
      accessibilityFilter: ['yes'],
      toiletFilter: [],
    },
    fullyWithWC: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Only fully accessible with accessible WC`,
      accessibilityFilter: ['yes'],
      toiletFilter: ['yes'],
    },
    unknown: {
      // translator: Button caption in the filter toolbar. Answer to the question 'which places you want to see'
      caption: t`Places that I can contribute information to`,
      accessibilityFilter: ['unknown'],
      toiletFilter: [],
    },
    notAccessible: {
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
  const availableFilters = getAvailableFilters();
  const { accessibilityFilter, toiletFilter } = props;
  const category = props.category || 'undefined';
  const currentFilterKey = findFilterKey({ accessibilityFilter, toiletFilter });
  const shownFilterKeys = currentFilterKey ? [currentFilterKey] : Object.keys(availableFilters);

  return (
    <section className={props.className} aria-label={t`Wheelchair accessibility filter`}>
      <section className="accessibility-filter">
        {shownFilterKeys.map(key => (
          <AccessibilityFilterButton
            accessibilityFilter={availableFilters[key].accessibilityFilter}
            toiletFilter={availableFilters[key].toiletFilter}
            caption={availableFilters[key].caption}
            category={category}
            isMainCategory
            isActive={currentFilterKey}
            showCloseButton={shownFilterKeys.length === 1}
            history={props.history}
            key={key}
            className="accessibility-filter-button"
          />
        ))}
      </section>
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

  button,
  label {
    display: flex;
    margin: 1em 0;
    align-items: center;
    font-size: 1rem;
    cursor: pointer;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 8px;
      &.toilet-filter-icon {
        width: 40px;
        height: 40px;
      }
    }

    .caption {
      flex: 1;
      text-align: left;
    }
  }

  .radio-button.focus-ring {
    border-radius: 100%;
    box-shadow: 0px 0px 0px 2px #4469e1;
  }

  .close-icon {
    margin-left: 1em;
  }
`;

export default StyledAccessibilityFilterMenu;
