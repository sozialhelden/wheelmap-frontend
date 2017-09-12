// @flow

import styled from 'styled-components';
import * as React from 'react';
import ChevronRight from './ChevronRight';
import type { WheelmapProperties, AccessibilityCloudProperties } from '../../lib/Feature.js';

import type { Category } from '../../lib/Categories';

type Props = {
  className: string,
  category: ?Category;
  parentCategory: ?Category;
  properties: WheelmapProperties | AccessibilityCloudProperties,
};

const BreadCrumbs = styled((props: Props) => {
  const region = props.properties && props.properties.region;
  const parentCategory = props.parentCategory && props.parentCategory._id;
  const category = props.category && props.category._id;
  const breadCrumbs = [
    region,
    parentCategory,
    category,
  ]
  .filter(Boolean)
  .map((s, i) => <span className='breadcrumb' key={i}>{s}<ChevronRight key={`c${i}`} /></span>);

  return (
    <section className={props.className}>
      {breadCrumbs}
    </section>
  );
})`
  color: rgba(0, 0, 0, 0.6);

  display: inline-block;
  &, .breadcrumb {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    line-height: 24px;
  }

  .breadcrumb:last-child .chevron-right {
    display: none;
  }
`;

export default BreadCrumbs;
