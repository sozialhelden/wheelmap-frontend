// @flow

import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import ChevronRight from '../ChevronRight';
import type { Category } from '../../lib/Categories';
import Categories, { type CategoryLookupTables } from '../../lib/Categories';
import { currentLocales } from '../../lib/i18n';
import type { AccessibilityCloudProperties, WheelmapProperties } from '../../lib/Feature';

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

  constructor(props: Props) {
    super(props);
    this.state.displayedCategoryNames = this.getCategoryNames(props);
  }

  componentWillMount() {
    this.setState({ displayedCategoryNames: this.getCategoryNames(this.props) });
  }

  componentWillReceiveProps(props: Props) {
    this.setState({ displayedCategoryNames: this.getCategoryNames(props) });
  }

  categoryIds(props) {
    const categoryId = props.category && props.category._id;
    return [categoryId];
  }

  getCategoryNames(props: Props) {
    return this.categoryIds(props)
      .filter(Boolean)
      .map(id => {
        const category = Categories.getCategory(props.categories, id);

        // Find best category translation … @TODO \o/ Sebastian! Right?
        const results = currentLocales
          .map(locale => {
            return get(category, `translations._id.${locale}`);
          })
          .filter(Boolean);

        return results[0];
      });
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
