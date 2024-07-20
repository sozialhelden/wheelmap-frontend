import * as React from 'react';
import styled from 'styled-components';
import Categories, { Category, CategoryLookupTables, getCategoryId } from '../../lib/Categories';
import { AccessibilityCloudProperties, WheelmapProperties } from '../../lib/Feature';
import { translatedStringFromObject } from '../../lib/i18n';
import ChevronRight from '../ChevronRight';

type Props = {
  className?: string,
  category: Category | null,
  categories: CategoryLookupTables,
  parentCategory: Category | null,
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

  UNSAFE_componentWillMount() {
    this.setState({ displayedCategoryNames: this.getCategoryNames(this.props) });
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({ displayedCategoryNames: this.getCategoryNames(props) });
  }

  categoryIds(props) {
    const categoryId = props.category && getCategoryId(props.category);
    return [categoryId];
  }

  getCategoryNames(props: Props) {
    return this.categoryIds(props)
      .filter(Boolean)
      .map(id => {
        const category = Categories.getCategory(props.categories, id);
        return translatedStringFromObject(category.translations._id);
      });
  }

  render() {
    const breadCrumbs = this.state.displayedCategoryNames.map((s, i) => (
      <span className="breadcrumb" key={i}>
        {s}
        <ChevronRight key={`c${i}`} />
      </span>
    ));

    return <div className={this.props.className}>{breadCrumbs}</div>;
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
  }

  .breadcrumb:last-child .chevron-right {
    display: none;
  }
`;

export default StyledBreadCrumbs;
