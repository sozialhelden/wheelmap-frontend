// @flow

import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import ChevronRight from './ChevronRight';
import Categories from  '../../lib/Categories';
import { currentLocale, defaultLocale } from '../../lib/i18n';
import type { Category } from '../../lib/Categories';
import type { WheelmapProperties, AccessibilityCloudProperties } from '../../lib/Feature';

type Props = {
  className: string,
  category: ?Category;
  parentCategory: ?Category;
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
    const promises = this.categoryIds(props)
      .filter(Boolean)
      .map(id => Categories.getCategory(id));
    Promise.all(promises).then(categories => {
      const names = categories.map(category => {
        return get(category, `translations._id.${currentLocale}`) ||
          get(category, `translations._id.${currentLocale.slice(0, 2)}`) ||
          get(category, `translations._id.${defaultLocale}`);
      });
      this.setState({ displayedCategoryNames: names.filter(Boolean) });
    });
  }

  render() {
    const breadCrumbs = this.state.displayedCategoryNames
      .map((s, i) => <span className="breadcrumb" key={i}>{s}<ChevronRight key={`c${i}`} /></span>);

    return (
      <section className={this.props.className} id="node-categories">
        {breadCrumbs}
      </section>
    );
  }
}

const StyledBreadCrumbs = styled(BreadCrumbs)`
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

export default StyledBreadCrumbs;
