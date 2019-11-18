import * as React from 'react';
import styled from 'styled-components';
import ChevronRight from '../ChevronRight';
import { Category } from '../../lib/Categories';
import Categories, { CategoryLookupTables } from '../../lib/Categories';
import { translatedStringFromObject } from '../../lib/i18n';
import { AccessibilityCloudProperties, WheelmapProperties } from '../../lib/Feature';
import { getCategoryId } from '../../lib/Categories';

type Props = {
  className?: string,
  category: Category | null,
  categories: CategoryLookupTables,
  parentCategory: Category | null,
  properties: WheelmapProperties | AccessibilityCloudProperties,
};

type State = {
  displayedCategoryNames: (string | void)[],
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
  }

  .breadcrumb:last-child .chevron-right {
    display: none;
  }
`;

export default StyledBreadCrumbs;
