// @flow
import React, { Component } from 'react';
import Swipeable from 'react-swipeable';
import styled from 'styled-components';
import type { AnyReactElement } from 'react-flow-types';
import colors from '../lib/colors';
import uniq from 'lodash/uniq';

const minimalHeight = 130;

type Props = {
  className: string,
  children: AnyReactElement,
};


type State = {
  topOffset: number,
  lastTopOffset: number;
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
    lastTopOffset: 0,
    topOffset: 0,
    scrollTop: 0,
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


  getStops(): number[] {
    let toolbarHeight = 0;
    if (this.scrollElement) {
      const style = window.getComputedStyle(this.scrollElement);
      toolbarHeight = parseFloat(style.marginTop) +
        parseFloat(style.marginBottom) +
        (this.scrollElement ? this.scrollElement.scrollHeight : 0);
    }
    const minimalTopPosition = this.state.viewportSize.height - toolbarHeight;
    return uniq([
      minimalTopPosition,
      Math.max(minimalTopPosition, Math.floor(this.state.viewportSize.height / 2)),
      this.state.viewportSize.height - minimalHeight,
    ]);
  }


  getPositionIndex(): number {
    if (this.state.viewportSize.width > this.state.viewportSize.height) {
      return 0;
    }
    return this.state.lastTopOffset;
  }


  getNearestStopForTopOffset(): number {
    const topOffset = this.state.topOffset;
    const stops = this.getStops();
    function distanceTo(positionName) {
      return Math.abs(stops[positionName] - topOffset);
    }
    let result = stops[0];
    let distance = distanceTo(result);
    stops.forEach((stop: number) => {
      if (stop - topOffset < distance) {
        distance = stop - topOffset;
        result = stop;
      }
    });
    return result;
  }


  getStyle(): { transform: string, touchAction: string, transition: string } {
    const lastTopOffset = this.state.lastTopOffset;
    const topOffset = this.state.topOffset || this.state.lastTopOffset;
    return {
      touchAction: lastTopOffset === 0 ? 'inherit' : 'none',
      transition: this.state.isSwiping ? '' : 'transform 0.3s ease-out',
      transform: `translate3d(0, ${topOffset}px, 0)`,
    };
  }


  onSwiping(e: TouchEvent, deltaX: number, deltaY: number, absX: number, absY: number) {
    if (this.scrollElement && this.scrollElement.scrollTop > 0) {
      this.setState({ scrollTop: this.state.scrollTop || this.scrollElement.scrollTop });
      return;
    }

    if (this.getPositionIndex() !== 'top') {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState({ isSwiping: true });
    this.setState({
      topOffset: Math.max(0, this.state.lastTopOffset - deltaY - this.state.scrollTop),
    });
  }


  onSwiped(e: TouchEvent, deltaX: number, deltaY: number, isFlick: boolean) {
    this.setState({ isSwiping: false, scrollTop: 0 });
    if (isFlick && !this.state.scrollTop) {
      const isSwipingUp = deltaY > 0;
      const indexDelta = isSwipingUp ? -1 : +1;
      const stops = this.getStops();
      const index = stops.indexOf(this.state.lastTopOffset) + indexDelta;
      const newIndex = Math.max(0, Math.min(stops.length - 1, index));
      this.setState({
        lastTopOffset: stops[newIndex],
        topOffset: 0,
      });
      return;
    }
    const newStop = this.getNearestStopForTopOffset();
    this.setState({
      lastTopOffset: newStop,
      topOffset: 0,
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
