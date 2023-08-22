import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import isPlainObject from 'lodash/isPlainObject';
import humanizeString from 'humanize-string';
import { AccessibilityAttributesMap } from '../../../lib/data-fetching/useAccessibilityAttributes';
import { translatedStringFromObject } from '../../../lib/i18n';
import StyledMarkdown from '../../StyledMarkdown';

function humanizeCamelCase(string: string) {
  return string.replace(/([a-z])([A-Z])/g, (substring, array) => {
    return `${substring[0]} ${substring[1].toLowerCase()}`;
  });
}

function getDescribedQuantity(value: { unit?: string; operator?: string; value?: number }) {
  if (!value) {
    return '';
  }

  const valueAndUnit = `${value.value || '?'} ${value.unit}`;

  switch (value.operator) {
    case '<=':
      return <span aria-label={t`${valueAndUnit} or less`}>≤ {valueAndUnit}</span>;
    case '>=':
      return <span aria-label={t`${valueAndUnit} or more`}>≥ {valueAndUnit}</span>;
    case '<':
      return <span aria-label={t`less than ${valueAndUnit}`}>&lt; {valueAndUnit}</span>;
    case '>':
      return <span aria-label={t`greater than ${valueAndUnit}`}>&gt; {valueAndUnit}</span>;
    case '=':
    case '==':
      return valueAndUnit;
    default:
      return `${value.operator ? `${value.operator} ` : ''}${value.value || '?'} ${value.unit}`;
  }
}

function formatName(
  name: string,
  accessibilityAttributes: Map<string, Record<string, string>>
): string {
  const string =
    (accessibilityAttributes && translatedStringFromObject(accessibilityAttributes.get(name))) ||
    humanizeString(name);
  return string.replace(/^Rating /, '');
}

function formatValue(value: any): string | JSX.Element {
  if (
    value === true ||
    (typeof value === 'string' && (value.match(/^true$/i) || value.match(/^yes$/i)))
  )
    return t`Yes`;
  if (
    value === false ||
    (typeof value === 'string' && (value.match(/^false$/i) || value.match(/^no$/i)))
  )
    return t`No`;
  if (
    isPlainObject(value) &&
    value &&
    typeof value === 'object' &&
    typeof value.unit === 'string' &&
    (typeof value.value === 'number' || typeof value.value === 'string')
  ) {
    return getDescribedQuantity(value);
  }
  return humanizeCamelCase(String(value));
}

function FormatRating({ rating }: { rating: number }) {
  const between1and5 = Math.floor(Math.min(1, Math.max(0, rating)) * 5);
  const stars = '★★★★★'.slice(5 - between1and5);
  return (
    <span aria-label={`${between1and5} stars`}>
      <span className="stars" aria-hidden="true">
        {stars}
      </span>
      <span className="numeric" aria-hidden="true">
        {between1and5}/5
      </span>
    </span>
  );
}

function DetailsArray({
  className,
  array,
  accessibilityAttributes,
  keyPrefix,
}: {
  className: string | null;
  array: any[];
  accessibilityAttributes: AccessibilityAttributesMap;
  keyPrefix?: string;
}) {
  // eslint-disable-next-line react/no-array-index-key
  const items = array.map((e, i) => (
    <li key={i}>
      <AccessibilityDetailsTree
        isNested={true}
        details={e}
        accessibilityAttributes={accessibilityAttributes}
        keyPrefix={`${keyPrefix}.${i}`}
      />
    </li>
  ));

  return (
    <ol className={`ac-list ${array.length === 1 ? 'has-only-one-item' : ''} ${className || ''}`}>
      {items}
    </ol>
  );
}

function capitalizeFirstLetter(string): string {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

function isLocalizedString(value: any): boolean {
  return isPlainObject(value) && Object.keys(value).every(key => key.match(/^\w\w[-_]?(?:\w\w)?$/));
}

function DetailsObject(props: {
  className: string | null;
  object: {};
  isNested?: boolean;
  accessibilityAttributes: AccessibilityAttributesMap;
  keyPrefix?: string;
}) {
  const { className, object, isNested } = props;
  const properties = Object.keys(object)
    .map(key => {
      if (key.match(/Localized/)) {
        return null;
      }

      const value = object[key];
      const name = formatName(key, props.accessibilityAttributes);

      // Screen readers work better when the first letter is capitalized.
      // If the attribute starts with a lowercase letter, there is no spoken pause
      // between the previous attribute value and the attribute name.
      const capitalizedName = humanizeCamelCase(capitalizeFirstLetter(name));

      if (value && (value instanceof Array || (isPlainObject(value) && !value.unit))) {
        if (key === 'name' || key === 'title') {
          return <header>{translatedStringFromObject(value)}</header>;
        }
        if (key === 'description') {
          return <section><StyledMarkdown>{translatedStringFromObject(value)}</StyledMarkdown></section>;
        }
        const subtree = (
          <AccessibilityDetailsTree
            isNested={true}
            details={value}
            accessibilityAttributes={props.accessibilityAttributes}
            keyPrefix={key}
          />
        );
        if (key.endsWith('properties')) {
          return <div key={`${key}-tree`}>{subtree}</div>;
        }
        return (
          <>
            <dt key={`${key}-name`} data-key={key}>
              {capitalizedName}
            </dt>
            <dd key={`${key}-tree`}>{subtree}</dd>
          </>
        );
      }

      if (key.startsWith('rating')) {
        return (
          <>
            <dt key={`${key}-name`} className="ac-rating">
              {capitalizedName}:
            </dt>
            <dd key={`${key}-rating`}>
              <FormatRating rating={parseFloat(String(value))} />
            </dd>
          </>
        );
      }
      const generatedClassName = `ac-${typeof value}`;
      const formattedValue = formatValue(value);
      return (
        <>
          <dt key={`${key}-name`} className={generatedClassName}>
            {capitalizedName}:
          </dt>
          <dd key={`${key}-value`} className={generatedClassName} aria-label={`${formattedValue}!`}>
            <em>{formattedValue}</em>
          </dd>
        </>
      );
    })
    .filter(Boolean);

  if (properties.length === 0) {
    return null;
  }

  return (
    <dl className={`ac-group ${className || ''}`} role={isNested ? null : 'text'}>
      {properties}
    </dl>
  );
}

type Props = {
  details: any;
  locale?: string | null;
  isNested?: boolean;
  className?: string | null;
  accessibilityAttributes: AccessibilityAttributesMap;
  keyPrefix?: string;
};

function AccessibilityDetailsTree(props: Props) {
  const details = props.details;
  if (details instanceof Array) {
    return (
      <DetailsArray
        className={props.className}
        array={details}
        accessibilityAttributes={props.accessibilityAttributes}
        keyPrefix={props.keyPrefix}
      />
    );
  }
  if (isPlainObject(details)) {
    return (
      <DetailsObject
        className={props.className}
        object={details}
        isNested={props.isNested}
        accessibilityAttributes={props.accessibilityAttributes}
        keyPrefix={props.keyPrefix}
      />
    );
  }
  return <div className={props.className}>{details}</div>;
}

AccessibilityDetailsTree.defaultProps = { className: null, locale: null };

const StyledAccessibilityDetailsTree = styled(AccessibilityDetailsTree)`
  box-sizing: border-box;
  line-height: 1.3;
  font-weight: 300;
  color: #444;
  margin: 0 -10px !important;
  padding: 10px !important;

  header {
    font-weight: 500;
  }

  ul {
    list-style-type: disc;
    margin-left: 1rem;
    &.has-only-one-item {
      list-style: none;
      margin-left: 0;
    }
  }

  ol {
    list-style-type: numeric;
    margin-left: 1rem;
    &.has-only-one-item {
      list-style: none;
      margin-left: 0;
    }
  }

  .ac-result-list,
  .ac-details > .ac-group {
    margin-left: 0;
  }

  .ac-details > dl.ac-group {
    padding: 0;
  }

  .ac-details em {
    font-style: normal;
  }

  .ac-group > .subtle {
    font-weight: 400;
  }

  dl {
    width: 100%;
    /*display: block;*/
    /*background-color: rgba(0, 0, 0, 0.1);*/
    overflow: auto;
    margin: 0;
  }

  dt {
    /*background-color: rgba(255, 0, 0, 0.1);*/
    float: left;
    clear: left;
    margin: 0;
    padding: 0;
  }

  dt[data-key] {
    font-weight: bolder;
  }

  dd {
    /*background-color: rgba(0, 255, 0, 0.1);*/
    margin-left: 0.5em;
    display: table-cell;
    padding: 0 0 0 0.3em;
  }

  dt[data-key='areas'] {
    display: none;
  }

  dt[data-key='areas'] + dd {
    padding: 0;
  }

  dt[data-key='entrances'] {
    width: 100%;
  }

  dt[data-key='entrances'] + dd {
    padding-left: 0;
  }

  .ac-group header {
    margin: 0.5em 0 0 0;
  }

  dt {
    margin-right: 0.5em;
    font-weight: normal;
    &[data-key] {
      font-weight: bold;
    }
  }

  dd {
    display: block;
    padding: 0;
  }

  dt[data-key='areas'] + dd {
    margin-left: 0;
  }

  > dt:not(:first-child) {
    margin-top: 10px;
    & + dd {
      margin-top: 10px;
    }
  }
`;

export default StyledAccessibilityDetailsTree;
