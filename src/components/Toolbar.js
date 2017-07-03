// @flow
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import styled from 'styled-components';
import type { AnyReactElement } from 'react-flow-types';
import colors from '../lib/colors';

const minimalHeight = 130;

type Props = {
  className: string,
  children: AnyReactElement,
};


type PositionName = 'top' | 'middle' | 'bottom';

const positionNames: PositionName[] = ['top', 'middle', 'bottom'];


type State = {
  positionIndex: number;
  topOffset: number,
  scrollTop: number,
  isSwiping: boolean,
  viewportSize: {
    width: number,
    height: number,
  }
};


class Toolbar extends Component<void, Props, State> {
  constructor(props: Props) {
    super(props);
    this.onResizeBound = this.onResize.bind(this);
  }

  scrollElement: ?HTMLElement;

  onResizeBound: (() => void);

  state = {
    positionIndex: positionNames.indexOf('bottom'),
    scrollTop: 0,
    topOffset: 0,
    isSwiping: false,
    viewportSize: {
      width: -1,
      height: -1,
    },
  };


  componentWillMount() {
    this.onResize();
    window.addEventListener('resize', this.onResizeBound);
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeBound);
  }


  onResize() {
    this.setState({
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }


  getPositionNamesToTopPositions(): { [PositionName]: number } {
    return {
      top: 0,
      middle: this.state.viewportSize.height / 2,
      bottom: this.state.viewportSize.height - minimalHeight,
    };
  }


  getTopOffsetForPositionName(position: PositionName): number {
    return this.getPositionNamesToTopPositions()[position];
  }


  getPositionName(): PositionName {
    if (this.state.viewportSize.width > this.state.viewportSize.height) {
      return 'top';
    }
    return positionNames[this.state.positionIndex];
  }


  getNearestPositionNameForTopOffset(): PositionName {
    const topOffset = this.state.topOffset;
    const positionNamesToTopPositions = this.getPositionNamesToTopPositions();
    function distanceTo(positionName) {
      return Math.abs(positionNamesToTopPositions[positionName] - topOffset);
    }
    let result = positionNames[0];
    let distance = distanceTo(result);
    Object.keys(positionNamesToTopPositions).forEach((positionName: PositionName) => {
      if (distanceTo(positionName) < distance) {
        distance = distanceTo(positionName);
        result = positionName;
      }
    });
    return result;
  }


  getStyle(): { top: string } {
    const positionName: PositionName = this.getPositionName();
    const topOffset = this.state.topOffset || this.getTopOffsetForPositionName(positionName);
    return {
      touchAction: positionName === 'top' ? 'inherit' : 'none',
      transition: this.state.isSwiping ? '' : 'transform 0.3s ease-out',
      transform: `translate3d(0, ${topOffset}px, 0)`,
    };
  }


  onSwiping(e: TouchEvent, deltaX: number, deltaY: number, absX: number, absY: number, velocity: number) {
    if (this.scrollElement && this.scrollElement.scrollTop > 0) {
      this.setState({ scrollTop: this.state.scrollTop || this.scrollElement.scrollTop });
      return;
    }

    if (this.getPositionName() !== 'top') {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState({ isSwiping: true });
    const positionName = this.getPositionName();
    const originalTopOffset = this.getTopOffsetForPositionName(positionName);
    this.setState({
      topOffset: Math.max(0, originalTopOffset - deltaY - this.state.scrollTop),
    });
  }


  onSwiped(e: TouchEvent, deltaX: number, deltaY: number, isFlick: boolean, velocity: number) {
    this.setState({ isSwiping: false, scrollTop: 0 });
    if (isFlick && !this.state.scrollTop) {
      const isSwipingUp = deltaY > 0;
      const indexDelta = isSwipingUp ? -1 : +1;
      const index = this.state.positionIndex + indexDelta;
      const clampedPositionNameIndex = Math.max(0, Math.min(positionNames.length - 1, index));
      this.setState({
        positionIndex: clampedPositionNameIndex,
        topOffset: 0,
      });
      return;
    }
    const newPositionName = this.getNearestPositionNameForTopOffset();
    this.setState({
      positionIndex: positionNames.indexOf(newPositionName),
      topOffset: this.getTopOffsetForPositionName(newPositionName),
    });
  }


  render() {
    return (<Swipeable
      onSwiping={this.onSwiping.bind(this)}
      onSwiped={this.onSwiped.bind(this)}
    >
      <nav
        style={this.getStyle()}
        className={['node-toolbar', this.props.className].filter(Boolean).join(' ')}
        ref={(nav) => { this.scrollElement = nav; }}
      >
        {this.props.children}
      </nav>
    </Swipeable>);
  }
}

const StyledToolbar = styled(Toolbar)`
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  max-height: calc(100% - 36px);
  margin: 10px;
  padding: 12px 15px 5px 15px;
  box-sizing: border-box;
  z-index: 1000;
  overflow: scroll;
  transform: translate3d(0, 0);

  font-size: 16px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: ${colors.colorizedBackgroundColor};

  & {
     -webkit-overflow-scrolling: touch;
  }

  &, * { /* switch on 3D acceleration for the panel */
    transform: scale3d(1, 1, 1);
  }

  @media (max-width: 512px) {
    width: calc(100% - 20px);
  }

  a.link-button {
    display: block;
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    border-radius: 4px;
    margin: 0 -10px;

    &:hover {
      background-color: #f2f2f2;
    }
  }
`;

export default StyledToolbar;
