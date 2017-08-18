// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

const StyledButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 4px;
  outline: none;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 150px;
  right: 10px;
  z-index: 400;
  cursor: pointer;
  &:hover {
    background-color: #f4f4f4;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(0, 0, 0, 0.75);
    border-radius: 11px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.75);
  }
`;

type Props = {
  className?: string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  onClick: (() => void),
}

const defaultProps = {
  className: '',
};

class FilterButton extends Component <typeof defaultProps, Props, void> {
  static defaultProps = defaultProps;
  props: Props;

  render() {
    // const accessibility = this.props.accessibilityFilter.map((f, i) => <StyledFilterPoint value={f} index={i} />);
    const toiletFilterHint = null;

    return (<StyledButton
      className={`${this.props.className} leaflet-filter-button`}
      title="Change which places are shown on the map"
      onClick={this.props.onClick}
    >
      <header><span>i</span></header>
      <footer>{toiletFilterHint}</footer>
    </StyledButton>);
  }
}


export default FilterButton;


// export function addFilterControlToMap(map: L.Map) {
//   const bar = document.createElement('div');
//   bar.className = 'leaflet-bar leaflet-control';
//   map._controlCorners.topright.appendChild(bar);
//   ReactDOM.render(<FilterButton />, bar);
// }
