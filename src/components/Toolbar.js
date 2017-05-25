import React, { Component } from 'react';
//import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {
  CategoryButton,
  CategoryMenu,
} from './Categories';
import { SearchInput } from './Search';

export default class Toolbar extends Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      categoryMenuIsVisible: false,
    };
    this.toggleCategoryMenu = this.toggleCategoryMenu.bind(this);
  }

  toggleCategoryMenu() {
    this.setState(prevState => ({
      categoryMenuIsVisible: !prevState.categoryMenuIsVisible,
    }));
  }

  render() {
    return (
      <div className={this.props.className, 'toolbar'}>
        {/*<CSSTransitionGroup
          transitionName="sidebar"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.state.categoryMenuIsVisible ? <CategoryMenu /> : null}
        </CSSTransitionGroup>*/}

        {this.state.categoryMenuIsVisible ? <CategoryMenu /> : null}

        <CategoryButton toggleCategoryMenu={this.toggleCategoryMenu} />
        <SearchInput />
      </div>
    );
  }
}
