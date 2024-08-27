import humanizeString from 'humanize-string'
import isPlainObject from 'lodash/isPlainObject'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { AccessibilityAttributesMap } from '../../../lib/data-fetching/useAccessibilityAttributes'
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject'

function humanizeCamelCase(string: string) {
  return string.replace(/([a-z])([A-Z])/g, (substring, array) => `${substring[0]} ${substring[1].toLowerCase()}`)
}

function formatName(
  name: string,
  accessibilityAttributes: Map<string, Record<string, string>>,
): string {
  const string = (accessibilityAttributes
      && translatedStringFromObject(accessibilityAttributes.get(name)))
    || humanizeString(name)
  return string.replace(/^Rating /, '')
}

function formatValue(value: any): string {
  if (
    value === true
    || (typeof value === 'string'
      && (value.match(/^true$/i) || value.match(/^yes$/i)))
  ) return t`Yes`
  if (
    value === false
    || (typeof value === 'string'
      && (value.match(/^false$/i) || value.match(/^no$/i)))
  ) return t`No`
  if (
    isPlainObject(value)
    && value
    && typeof value === 'object'
    && typeof value.unit === 'string'
    && (typeof value.value === 'number' || typeof value.value === 'string')
  ) {
    return `${value.value || '?'} ${value.unit}`
  }
  return humanizeCamelCase(String(value))
}

function FormatRating({ rating }: { rating: number }) {
  const between1and5 = Math.floor(Math.min(1, Math.max(0, rating)) * 5)
  const stars = '★★★★★'.slice(5 - between1and5)
  return (
    <span aria-label={`${between1and5} stars`}>
      <span className="stars" aria-hidden="true">
        {stars}
      </span>
      <span className="numeric" aria-hidden="true">
        {between1and5}
        /5
      </span>
    </span>
  )
}

function DetailsArray({
  className,
  array,
  accessibilityAttributes,
}: {
  className: string | null;
  array: any[];
  accessibilityAttributes: AccessibilityAttributesMap;
}) {
  // eslint-disable-next-line react/no-array-index-key
  const items = array.map((e, i) => (
    <li key={i}>
      <AccessibilityDetailsTree
        isNested
        details={e}
        accessibilityAttributes={accessibilityAttributes}
      />
    </li>
  ))
  return <ul className={`ac-list ${className || ''}`}>{items}</ul>
}

function capitalizeFirstLetter(string): string {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

function DetailsObject(props: {
  className: string | null;
  object: {};
  isNested?: boolean;
  accessibilityAttributes: AccessibilityAttributesMap;
}) {
  const { className, object, isNested } = props
  const properties = Object.keys(object)
    .map((key) => {
      if (key.match(/Localized/)) {
        return null
      }

      const value = object[key]
      const name = formatName(key, props.accessibilityAttributes)

      // Screen readers work better when the first letter is capitalized.
      // If the attribute starts with a lowercase letter, there is no spoken pause
      // between the previous attribute value and the attribute name.
      const capitalizedName = humanizeCamelCase(capitalizeFirstLetter(name))

      if (
        value
        && (value instanceof Array || (isPlainObject(value) && !value.unit))
      ) {
        return [
          <dt key={`${key}-name`} data-key={key}>
            {capitalizedName}
          </dt>,
          <dd key={`${key}-tree`}>
            <AccessibilityDetailsTree
              isNested
              details={value}
              accessibilityAttributes={props.accessibilityAttributes}
            />
          </dd>,
        ]
      }
      if (key.startsWith('rating')) {
        return [
          <dt key={`${key}-name`} className="ac-rating">
            {capitalizedName}
            :
          </dt>,
          <dd key={`${key}-rating`}>
            <FormatRating rating={parseFloat(String(value))} />
          </dd>,
        ]
      }
      const generatedClassName = `ac-${typeof value}`
      const formattedValue = formatValue(value)
      return [
        <dt key={`${key}-name`} className={generatedClassName}>
          {capitalizedName}
          :
        </dt>,
        <dd
          key={`${key}-value`}
          className={generatedClassName}
          aria-label={`${formattedValue}!`}
        >
          <em>{formattedValue}</em>
        </dd>,
      ]
    })
    .filter(Boolean)

  if (properties.length === 0) {
    return null
  }

  return (
    <dl
      className={`ac-group ${className || ''}`}
      role={isNested ? null : 'text'}
    >
      {properties}
    </dl>
  )
}

type Props = {
  details: any;
  locale?: string | null;
  isNested?: boolean;
  className?: string | null;
  accessibilityAttributes: AccessibilityAttributesMap;
};

function AccessibilityDetailsTree(props: Props) {
  const { details } = props
  if (details instanceof Array) {
    return (
      <DetailsArray
        className={props.className}
        array={details}
        accessibilityAttributes={props.accessibilityAttributes}
      />
    )
  }
  if (isPlainObject(details)) {
    return (
      <DetailsObject
        className={props.className}
        object={details}
        isNested={props.isNested}
        accessibilityAttributes={props.accessibilityAttributes}
      />
    )
  }
  return <div className={props.className}>{details}</div>
}

AccessibilityDetailsTree.defaultProps = { className: null, locale: null }

const StyledAccessibilityDetailsTree = styled(AccessibilityDetailsTree)`
  box-sizing: border-box;
  line-height: 1.3;
  font-weight: 300;
  color: #444;
  margin: 0 -10px !important;
  padding: 10px !important;

  ul {
    list-style: none;
  }

  .ac-result-list,
  .ac-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    font-weight: 300;
    color: #444;
    line-height: 1.3;
  }

  .ac-result-list a:hover {
    font-weight: 400;
  }

  .ac-result {
    position: relative;
    max-width: 450px;
    margin: 0 0 1.5em 0;
    padding: 0.2em;
    padding-left: 3em;
  }

  .ac-result[aria-controls] {
    cursor: pointer;
  }

  .ac-result img {
    left: 0.5em;
    width: 2em;
    height: 2em;
    position: absolute;
    opacity: 0.8;
  }

  .ac-result a {
    text-decoration: none;
  }

  .ac-result:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .ac-result-name {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.98);
    float: left;
  }

  .ac-result-category {
    clear: both;
  }

  .ac-result-distance {
    float: right;
    white-space: nowrap;
    word-spacing: -0.15em;
  }

  .ac-result-distance-icon {
    height: 1em;
    vertical-align: top;
    opacity: 0.2;
  }

  .ac-result-distance-icon polygon {
    fill: currentColor;
  }

  .ac-result-link {
    float: right;
  }

  .ac-summary {
    font-weight: bolder;
  }

  .ac-summary:hover .ac-info-icon {
    opacity: 0.8;
  }

  .ac-result-extra-info {
    font-size: 0.75em;
    line-height: 1.25em;
    opacity: 0.8;
    margin: 0.5em 8em 0.5em 0;
  }

  .ac-info-icon {
    opacity: 0.3;
    height: 1em;
    margin-left: 0.2em;
    margin-bottom: -0.17em;
    transition: opacity 0.3s ease-out;
  }

  .ac-details > dl.ac-group {
    padding: 0;
  }

  .ac-details em {
    font-style: normal;
  }

  .ac-result .ac-group > .subtle {
    font-weight: 400;
  }

  .ac-result dl {
    width: 100%;
    /*display: block;*/
    /*background-color: rgba(0, 0, 0, 0.1);*/
    overflow: auto;
    margin: 0;
  }

  .ac-result dt {
    /*background-color: rgba(255, 0, 0, 0.1);*/
    float: left;
    clear: left;
    margin: 0;
    padding: 0;
  }

  .ac-result dt[data-key] {
    font-weight: bolder;
  }

  .ac-result dd {
    /*background-color: rgba(0, 255, 0, 0.1);*/
    margin-left: 1em;
    display: table-cell;
    padding: 0 0 0 0.3em;
  }

  dt[data-key="areas"] {
    display: none;
  }

  dt[data-key="areas"] + dd {
    padding: 0;
  }

  dt[data-key="entrances"] {
    width: 100%;
  }
  dt[data-key="entrances"] + dd {
    padding-left: 1em;
  }

  .ac-result .ac-group header {
    margin: 0.5em 0 0 0;
  }

  .ac-result {
    display: block;
    outline: none;
    border: none;
    background: none;
    list-style: none;
    font: inherit;
    text-align: inherit;
    width: 100%;
    box-sizing: border-box;
  }

  .ac-result .ac-details {
    display: none;
  }

  @keyframes ac-fadein {
    0% {
      opacity: 0;
      max-height: 0;
    }
    100% {
      opacity: 1;
      max-height: 500px;
    }
  }

  .ac-result[aria-expanded="true"] .ac-details {
    display: block;
    animation: ac-fadein 0.5s ease-out;
  }

  .ac-result[aria-expanded="true"] .ac-info-icon {
    opacity: 0;
  }

  .ac-error {
    color: red;
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

  dt[data-key="areas"] {
    display: none;
  }

  dt[data-key="areas"] + dd {
    padding: 0;
  }

  dt[data-key="entrances"] {
    width: 100%;
  }

  dt[data-key="entrances"] + dd {
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

  dt[data-key="areas"] + dd {
    margin-left: 0;
  }

  > dt:not(:first-child) {
    margin-top: 10px;
    & + dd {
      margin-top: 10px;
    }
  }
`

export default StyledAccessibilityDetailsTree
