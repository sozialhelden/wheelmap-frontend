// @flow

import get from 'lodash/get';
import findLast from 'lodash/findLast';
import * as React from 'react';
import styled from 'styled-components';
import ChevronRight from '../ChevronRight';
import Categories, { type CategoryLookupTables } from '../../lib/Categories';
import { currentLocales } from '../../lib/i18n';
import type { Category } from '../../lib/Categories';
import type { WheelmapProperties, AccessibilityCloudProperties } from '../../lib/Feature';

type Props = {
  className: string,
  category: ?Category,
  categories: CategoryLookupTables,
  parentCategory: ?Category,
  properties: WheelmapProperties | AccessibilityCloudProperties,
};

type State = {
  displayedCategoryNames: string[],
};

class BreadCrumbs extends React.Component<Props, State> {
  state = {
    displayedCategoryNames: [],
  };

  componentWillMount() {
    this.setState({ displayedCategoryNames: this.categoryIds(this.props) });
    this.loadCategories(this.props);
  }

  componentWillReceiveProps(props: Props) {
    this.loadCategories(props);
  }

  categoryIds(props) {
    // const parentCategoryId = props.parentCategory && props.parentCategory._id;
    const categoryId = props.category && props.category._id;
    // return [parentCategoryId, categoryId];
    return [categoryId];
  }

  loadCategories(props: Props) {
    const names = this.categoryIds(props)
      .filter(Boolean)
      .map(id => {
        const category = Categories.getCategory(props.categories, id);

        // Find last AC category … @TODO \o/ Sebastian! Right?
        const result = findLast(currentLocales, locale => {
          return get(category, `translations._id.${locale}`);
        });

        /*currentLocales.find(locale => {
          result = get(category, `translations._id.${locale}`);
          return !!result;
        });*/

        return result;
      });

    this.setState({ displayedCategoryNames: names.filter(Boolean) });
  }

  render() {
    const breadCrumbs = this.state.displayedCategoryNames.map((s, i) => (
      <span className="breadcrumb" key={i}>
        {s}
        <ChevronRight key={`c${i}`} />
      </span>
    ));

    return <section className={this.props.className}>{breadCrumbs}</section>;
  }
}

const StyledBreadCrumbs = styled(BreadCrumbs)`
  color: rgba(0, 0, 0, 0.6);

  display: inline-block;
  &,
  .breadcrumb {
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

export default StyledBreadCrumbs;
