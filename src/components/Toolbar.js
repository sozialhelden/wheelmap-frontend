// @flow
import uniq from 'lodash/uniq';
import styled from 'styled-components';
import Swipeable from 'react-swipeable';
import React, { Component } from 'react';
import type { AnyReactElement } from 'react-flow-types';
import colors from '../lib/colors';


type Props = {
  className: string,
  children: AnyReactElement,
  hidden?: boolean,
  minimalHeight?: number,
};


const defaultProps = {
  hidden: false,
  minimalHeight: 130,
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


class Toolbar extends Component<typeof defaultProps, Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    this.onResizeBound = this.onResize.bind(this);
  }

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


  componentDidMount() {
    this.onResize();
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeBound);
  }


  onResizeBound: (() => void);


  onResize() {
    this.setState({
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }


  onSwiping(e: TouchEvent, deltaX: number, deltaY: number) {
    if (this.scrollElement && this.scrollElement.scrollTop > 0) {
      this.setState({ scrollTop: this.state.scrollTop || this.scrollElement.scrollTop });
      return;
    }

    if (this.state.lastTopOffset !== 0) {
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


  getNearestStopForTopOffset(): number {
    const topOffset = this.state.topOffset;
    const stops = this.getStops();
    function distanceTo(position) {
      return Math.abs(position - topOffset);
    }
    let result = stops[0];
    let distance = distanceTo(result);
    stops.forEach((stop: number) => {
      if (distanceTo(stop) < distance) {
        distance = distanceTo(stop);
        result = stop;
      }
    });
    return result;
  }


  getMinimalTopPosition(): number {
    let toolbarHeight = 0;
    if (this.scrollElement) {
      const style = window.getComputedStyle(this.scrollElement);
      toolbarHeight = parseFloat(style.marginTop) +
        parseFloat(style.marginBottom) +
        (this.scrollElement ? this.scrollElement.scrollHeight : 0);
    }
    return this.state.viewportSize.height - toolbarHeight;
  }


  getStops(): number[] {
    const minimalTopPosition = this.getMinimalTopPosition();
    return uniq([
      minimalTopPosition,
      Math.max(minimalTopPosition, Math.floor(this.state.viewportSize.height / 2)),
      this.state.viewportSize.height - (this.props.minimalHeight || 0),
    ]);
  }


  getStyle(): { transform: string, touchAction: string, transition: string } {
    const lastTopOffset = this.state.lastTopOffset;

    let topOffset = this.state.topOffset || this.state.lastTopOffset;
    topOffset = Math.max(this.getMinimalTopPosition(), topOffset);
    if (this.state.viewportSize.width > this.state.viewportSize.height || this.state.viewportSize.width >= 512) {
      topOffset = 0;
    }

    const defaultTransitions = 'opacity 0.3s ease-out';

    return {
      touchAction: lastTopOffset === 0 ? 'inherit' : 'none',
      transition: this.state.isSwiping ? defaultTransitions : `${defaultTransitions}, transform 0.3s ease-out`,
      transform: `translate3d(0, ${topOffset}px, 0)`,
    };
  }


  scrollElement: ?HTMLElement;


  render() {
    const classNames = [
      'node-toolbar',
      this.props.hidden ? 'toolbar-hidden' : null,
      this.props.className,
    ];
    const className = classNames.filter(Boolean).join(' ');
    return (<Swipeable
      onSwiping={(e, deltaX, deltaY) => this.onSwiping(e, deltaX, deltaY)}
      onSwiped={(e, deltaX, deltaY, isFlick) => this.onSwiped(e, deltaX, deltaY, isFlick)}
    >
      <nav
        style={this.getStyle()}
        className={className}
        ref={(nav) => { this.scrollElement = nav; }}
      >
        <div className="grab-handle"></div>
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
  min-width: 320px;
  max-height: calc(100% - 36px);
  margin: 10px;
  padding: 12px 15px 5px 15px;
  box-sizing: border-box;
  z-index: 1000;
  overflow: scroll;
  transform: translate3d(0, 0);

  font-size: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: ${colors.colorizedBackgroundColor};

  & {
     -webkit-overflow-scrolling: touch;
  }

  & { /* switch on 3D acceleration for the panel */
    transform: scale3d(1, 1, 1);
  }

  @media (max-width: 768px) {
    width: calc(50% - 20px);
    min-width: 250px;
  }
  .grab-handle {
    display: none;
  }


  @media (max-width: 512px) {
    width: calc(100% - 20px);
    min-width: 250px;
  }

  a.link-button {
    display: block;

    /* handle to signalize you can resize by swiping */
    .grab-handle {
      display: block;
      margin: -5px auto 0 auto;
      left: 50%;
      width: 44px;
      height: 5px;
      border-radius: 2.5px;
      background-color: rgba(0, 0, 0, 0.2);
      margin-bottom: 0.5em;
    }
    font-size: 15px;
    padding: 10px;
    text-decoration: none;
    border-radius: 4px;
    margin: 0 -10px;

    &:hover {
      background-color: #f2f2f2;
    }
  }

  &.toolbar-hidden {
    opacity: 0;
  }
`;

export default StyledToolbar;
