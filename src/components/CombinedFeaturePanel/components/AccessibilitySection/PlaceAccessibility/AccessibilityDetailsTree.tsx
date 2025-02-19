import type { Accessibility } from "@sozialhelden/a11yjson";
import { t } from "@transifex/native";
import humanizeString from "humanize-string";
import isPlainObject from "lodash/isPlainObject";
import * as React from "react";
import { type FC, Fragment } from "react";
import styled from "styled-components";
import { useTranslatedStringFromObject } from "../../../../../lib/i18n/useTranslatedStringFromObject";
import type IAccessibilityAttribute from "../../../../../lib/model/ac/IAccessibilityAttribute";
import { cx } from "../../../../../lib/util/cx";

type AccessibilityAttributesMap = Map<
  string,
  IAccessibilityAttribute | undefined
>;

const humanizeCamelCase = (string: string) =>
  string.replace(
    /([a-z])([A-Z])/g,
    (substring) => `${substring[0]} ${substring[1].toLowerCase()}`,
  );

const formatName = (
  name: string,
  accessibilityAttributes: AccessibilityAttributesMap,
): string => {
  const string =
    (accessibilityAttributes &&
      useTranslatedStringFromObject(
        accessibilityAttributes.get(name)?.label,
      )) ||
    humanizeString(name);
  return string.replace(/^Rating /, "");
};

const formatValue = (value: unknown): string => {
  if (
    value === true ||
    (typeof value === "string" &&
      (value.match(/^true$/i) || value.match(/^yes$/i)))
  )
    return t("Yes");
  if (
    value === false ||
    (typeof value === "string" &&
      (value.match(/^false$/i) || value.match(/^no$/i)))
  )
    return t("No");
  if (
    isPlainObject(value) &&
    value &&
    typeof value === "object" &&
    "unit" in value &&
    typeof (value as { unit: string }).unit === "string" &&
    "value" in value &&
    ((value as { value: unknown }).value === null ||
      typeof (value as { value: unknown }).value === "number" ||
      typeof (value as { value: unknown }).value === "string")
  ) {
    const typedValue = value as { unit: string; value: string | number | null };
    return `${typedValue.value || "?"} ${typedValue.unit}`;
  }
  return humanizeCamelCase(String(value));
};

const Rating: FC<{
  capitalizedName: string;
  rating: number;
  keyName: string;
}> = ({ capitalizedName, keyName, rating }) => {
  const between1and5 = Math.floor(Math.min(1, Math.max(0, rating)) * 5);
  const stars = "★★★★★".slice(5 - between1and5);
  return (
    <>
      <dt key={`${keyName}-name`} className="ac-rating">
        {capitalizedName}:
      </dt>
      <dd key={`${keyName}-rating`}>
        <span aria-label={`${between1and5} stars`}>
          <span className="stars" aria-hidden="true">
            {stars}
          </span>
          <span className="numeric" aria-hidden="true">
            {between1and5}
            /5
          </span>
        </span>
      </dd>
    </>
  );
};

const Value: FC<{ className: string; title: string; value: string }> = ({
  className,
  title,
  value,
}) => (
  <>
    <dt className={className}>{title}:</dt>
    <dd className={className} aria-label={`${value}!`}>
      <em>{value}</em>
    </dd>
  </>
);

const capitalizeFirstLetter = (string: string): string =>
  string.charAt(0).toLocaleUpperCase() + string.slice(1);

const isCategory = (value: unknown) =>
  value &&
  (Array.isArray(value) ||
    (isPlainObject(value) &&
      value !== null &&
      typeof value === "object" &&
      !("unit" in value)));

const AccessibilityDetailsTree: FC<{
  className?: string;
  details: Accessibility;
  isNested?: boolean;
  accessibilityAttributes: AccessibilityAttributesMap;
}> = ({ className, details, isNested, accessibilityAttributes }) => {
  // null/undefined do not get rendered
  if (details === undefined || details === null) {
    return null;
  }
  // simple values just get emitted as is
  if (
    typeof details === "string" ||
    typeof details === "number" ||
    typeof details === "bigint" ||
    typeof details === "boolean"
  ) {
    return details;
  }

  if (Array.isArray(details)) {
    // arrays with no entries do not get rendered
    if (details.length === 0) {
      return null;
    }
    // arrays with only one entry get directly inlined
    if (details.length === 1) {
      return (
        <AccessibilityDetailsTree
          isNested
          details={details[0]}
          accessibilityAttributes={accessibilityAttributes}
        />
      );
    }
    // otherwise arrays are treated as lists
    return (
      <ul className={cx("ac-list", className)}>
        {details.map((e, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: This is a list, the index is the key
          <li key={i}>
            <AccessibilityDetailsTree
              isNested
              details={e}
              accessibilityAttributes={accessibilityAttributes}
            />
          </li>
        ))}
      </ul>
    );
  }

  const keys = Object.keys(details).filter(
    (key) => key && !key.match(/Localized/),
  );
  // objects with no relevant keys do not get rendered
  if (keys.length <= 0) {
    return null;
  }

  return (
    <dl
      className={`ac-group ${className || ""}`}
      role={isNested ? undefined : "text"}
    >
      {keys.map((key) => {
        const value = details[key];
        const name = formatName(key, accessibilityAttributes);

        // Screen readers work better when the first letter is capitalized.
        // If the attribute starts with a lowercase letter, there is no spoken pause
        // between the previous attribute value and the attribute name.
        const capitalizedName = humanizeCamelCase(capitalizeFirstLetter(name));

        if (isCategory(value)) {
          return (
            <Fragment key={key}>
              <dt data-key={key}>{capitalizedName}</dt>
              <dd>
                <AccessibilityDetailsTree
                  isNested
                  details={value}
                  accessibilityAttributes={accessibilityAttributes}
                />
              </dd>
            </Fragment>
          );
        }

        if (key.startsWith("rating")) {
          return (
            <Rating
              keyName={key}
              key={key}
              rating={Number.parseFloat(`${value}`)}
              capitalizedName={capitalizedName}
            />
          );
        }
        const generatedClassName = `ac-${typeof value}`;
        const formattedValue = formatValue(value);
        return (
          <Value
            key={key}
            className={generatedClassName}
            title={capitalizedName}
            value={formattedValue}
          />
        );
      })}
    </dl>
  );
};

const StyledAccessibilityDetailsTree = styled(AccessibilityDetailsTree)`
  box-sizing: border-box;
  line-height: 1.3;
  font-weight: 300;
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
    line-height: 1.3;

    > li {
      width: 100%;
    }
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

  @keyframes ac-fade-in {
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
    animation: ac-fade-in 0.5s ease-out;
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
`;

export default StyledAccessibilityDetailsTree;
