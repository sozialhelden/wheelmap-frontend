// @flow
import { t } from 'ttag';
import { hsl } from 'd3-color';
import uniq from 'lodash/uniq';
import includes from 'lodash/includes';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import Swipeable from 'react-swipeable';
import * as React from 'react';
import type { AnyReactElement } from 'react-flow-types';
import colors from '../lib/colors';
import { isOnSmallViewport } from '../lib/ViewportSize';

type Props = {
  className: string,
  children: AnyReactElement,
  hidden?: boolean,
  inert?: boolean,
  role?: string,
  ariaLabel?: string,
  ariaDescribedBy?: string,
  minimalHeight?: number,
  isSwipeable?: boolean,
  isModal?: boolean,
  enableTransitions?: boolean,
  startTopOffset?: number,
  onScrollable?: (isScrollable: boolean) => void,
};

type State = {
  topOffset: number,
  lastTopOffset: number,
  scrollTop: number,
  isSwiping: boolean,
  viewportSize: {
    width: number,
    height: number,
  },
};

/**
 * A toolbar that shows as a card that you can swipe up and down on small viewports, and that has
 * a fixed position on bigger viewports.
 *
 * Automatically becomes scrollable when fully visible.
 *
 * Can be modal and is not swipeable then.
 */

class Toolbar extends React.Component<Props, State> {
  static defaultProps = {
    hidden: false,
    minimalHeight: 145,
    isSwipeable: true,
    isModal: false,
    role: '',
    enableTransitions: true,
  };

  props: Props;

  ensureVisibilityTimeoutId: ?number;
  startTopOffsetTimeoutId: ?number;

  scrollElement: ?HTMLElement;

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

  onWindowResize = debounce(() => {
    this.onResize();
  }, 200);

  componentWillMount() {
    this.onResize();
    if (typeof window !== 'undefined') {
      window.addEventListener(('resize', this.onWindowResize));
    }
  }

  componentDidMount() {
    this.onResize(this.props.startTopOffset);
    if (this.props.isModal) this.ensureFullVisibility();
    this.startTopOffsetTimeoutId = setTimeout(() => {
      this.startTopOffsetTimeoutId = undefined;
      this.onResize(this.props.startTopOffset);
    }, 100);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener(('resize', this.onWindowResize));
    }
    if (this.ensureVisibilityTimeoutId) {
      clearTimeout(this.ensureVisibilityTimeoutId);
      this.ensureVisibilityTimeoutId = undefined;
    }
    if (this.startTopOffsetTimeoutId) {
      clearTimeout(this.startTopOffsetTimeoutId);
      this.startTopOffsetTimeoutId = undefined;
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.isModal !== this.props.isModal) {
      this.ensureFullVisibility();
    }
  }

  /** Moves the toolbar to show as much of its content as possible. */
  ensureFullVisibility() {
    if (!this._ensureVisibilityTimeoutId) {
      this.ensureVisibilityTimeoutId = setTimeout(() => {
        this.ensureVisibilityTimeoutId = undefined;
        this.setState({ topOffset: 0 });
        this.onResize();
      }, 150);
    }
  }

  onResize(preferredTopOffset: number = this.state.topOffset) {
    this.setState({
      viewportSize: {
        width: typeof window === 'undefined' ? 1024 : window.innerWidth,
        height: typeof window === 'undefined' ? 768 : window.innerHeight,
      },
    });

    const topOffset = this.getNearestStopForTopOffset(preferredTopOffset);
    this.setState({
      topOffset,
      lastTopOffset: topOffset,
    });
  }

  onSwiping(e: TouchEvent, deltaX: number, deltaY: number) {
    if (!this.props.isSwipeable || this.props.isModal) {
      return;
    }
    if (this.scrollElement && this.scrollElement.scrollTop > 0 && !this.state.isSwiping) {
      this.setState({ scrollTop: this.state.scrollTop || this.scrollElement.scrollTop });
      return;
    }

    if (!this.isAtTopmostPosition()) {
      e.preventDefault();
      // e.stopPropagation();
      console.log('Prevented scrolling');
    }

    const topmostPosition = this.getTopmostPosition();
    const touchTopOffset = this.state.lastTopOffset - deltaY - this.state.scrollTop;
    const topOffset = Math.max(topmostPosition, touchTopOffset);

    if (this.scrollElement && touchTopOffset < topmostPosition) {
      this.scrollElement.scrollTop = topmostPosition - touchTopOffset;
    }

    this.setState({ isSwiping: true });
    this.setState({ topOffset });
  }

  onSwiped(e: TouchEvent, deltaX: number, deltaY: number, isFlick: boolean) {
    if (!this.props.isSwipeable || this.props.isModal || this.isLandscapePhone()) {
      return;
    }
    this.setState({ isSwiping: false, scrollTop: 0 });
    if (isFlick && !this.state.scrollTop) {
      const isSwipingUp = deltaY > 0;
      const stops = this.getStops();
      const newIndex = isSwipingUp ? 0 : stops.length - 1;
      this.setState({
        lastTopOffset: stops[newIndex],
        topOffset: 0,
      });
      return;
    }
    const newStop = this.getNearestStopForTopOffset(this.state.topOffset);
    this.setState({
      lastTopOffset: newStop,
      topOffset: 0,
    });
  }

  /** @returns the next preferred stop position */

  getNearestStopForTopOffset(topOffset: number): number {
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

  /** @returns the maximal top position for the toolbar to stay interactable. */

  getTopmostPosition(): number {
    let toolbarHeight = 0;
    if (this.scrollElement) {
      const style = window.getComputedStyle(this.scrollElement);
      toolbarHeight =
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom) +
        (this.scrollElement ? this.scrollElement.scrollHeight : 0);
    }
    return Math.max(60, this.state.viewportSize.height - toolbarHeight - 60);
  }

  /** @returns An array of top position offsets that the toolbar is allowed to stop on. */

  getStops(): number[] {
    const topmostPosition = this.getTopmostPosition();
    if (this.isLandscapePhone()) {
      return [topmostPosition];
    }
    const stops = uniq([
      topmostPosition,
      Math.max(topmostPosition, Math.floor(this.state.viewportSize.height / 2)),
      this.state.viewportSize.height - (this.props.minimalHeight || 0),
    ]);
    return stops;
  }

  isFullyExpanded() {
    const stops = this.getStops();
    return this.state.topOffset === stops[0];
  }

  isAtTopmostPosition() {
    return (this.state.topOffset || this.state.lastTopOffset) <= this.getTopmostPosition();
  }

  isLandscapePhone() {
    return isOnSmallViewport() && this.state.viewportSize.width > this.state.viewportSize.height;
  }

  getStyle(): { transform: string, touchAction: string, transition: string, overflowY: string } {
    const lastTopOffset = this.state.lastTopOffset;

    let topOffset = this.state.topOffset || lastTopOffset;
    topOffset = Math.max(this.getTopmostPosition(), topOffset);
    const isLandscape = this.state.viewportSize.width > this.state.viewportSize.height;
    const isBigViewport = this.state.viewportSize.width > 512;
    if (isLandscape || isBigViewport) {
      topOffset = 0;
    }

    const defaultTransitions = 'opacity 0.3s ease-out';
    const isSwiping = this.state.isSwiping;
    const { enableTransitions } = this.props;
    const isAtTopmostPosition = this.isAtTopmostPosition();
    return {
      touchAction: isAtTopmostPosition ? 'inherit' : 'none',
      overflowY: isAtTopmostPosition ? 'auto' : 'hidden',
      transition: enableTransitions
        ? isSwiping ? defaultTransitions : `${defaultTransitions}, transform 0.3s ease-out`
        : '',
      transform: `translate3d(0, ${topOffset}px, 0)`,
    };
  }

  cancelTouchIfMoving = (event: TouchEvent) => {
    const isScrollable = this.isAtTopmostPosition();
    if (this.props.onScrollable) {
      this.props.onScrollable(isScrollable);
    }
    if (isScrollable) {
      // Do not prevent scrolling
      return;
    }
    // Prevent native scrolling because we do it ourselves
    event.preventDefault();
  };

  render() {
    const xModels = ['iPhone10,3', 'iPhone10,6', 'x86_64'];
    const isIphoneX =
      typeof window !== 'undefined' &&
      window.device &&
      window.device.model &&
      includes(xModels, window.device.model);
    const classNames = [
      'toolbar',
      isIphoneX ? 'toolbar-iphone-x' : null,
      this.props.hidden ? 'toolbar-hidden' : null,
      this.props.isModal ? 'toolbar-is-modal' : null,
      this.state.lastTopOffset === this.getTopmostPosition() ? 'toolbar-is-at-top' : null,
      this.props.className,
    ];
    const className = classNames.filter(Boolean).join(' ');
    return (
      <Swipeable
        onSwiping={(e, deltaX, deltaY) => this.onSwiping(e, deltaX, deltaY)}
        onSwiped={(e, deltaX, deltaY, isFlick) => this.onSwiped(e, deltaX, deltaY, isFlick)}
      >
        <section
          className={className}
          style={this.getStyle()}
          ref={nav => {
            this.scrollElement = nav;
          }}
          aria-hidden={this.props.inert}
          role={this.props.role}
          aria-label={this.props.ariaLabel}
          aria-describedby={this.props.ariaDescribedBy}
          data-last-top-offset={this.state.lastTopOffset}
          onTouchMove={this.cancelTouchIfMoving}
        >
          {this.props.isSwipeable && !this.props.isModal ? (
            <button
              className="grab-handle"
              aria-label={this.isFullyExpanded() ? t`Collapse details` : t`Expand details`}
              onClick={() => {
                if (this.isFullyExpanded()) {
                  const stops = this.getStops();
                  const offset = stops[stops.length - 1];
                  this.setState({ lastTopOffset: offset, topOffset: offset });
                } else {
                  this.ensureFullVisibility();
                }
              }}
            />
          ) : null}
          {this.props.children}
        </section>
      </Swipeable>
    );
  }
}

const StyledToolbar = styled(Toolbar)`
  position: fixed;

  user-select: none;
  -webkit-user-drag: none;

  /* Positioning */
  left: 0;
  left: constant(safe-area-inset-left);
  left: env(safe-area-inset-left);
  top: 50px;
  top: calc(50px + constant(safe-area-inset-top));
  top: calc(50px + env(safe-area-inset-top));

  /* Sizing (more sizing for different viewports below) */
  box-sizing: border-box;
  width: 320px;
  min-width: 320px;
  max-height: calc(100% - 80px);
  max-height: calc(100% - 80px - constant(safe-area-inset-top));
  max-height: calc(100% - 80px - env(safe-area-inset-top));

  &.toolbar-is-modal {
    @media (max-height: 512px), (max-width: 512px) {
      top: 0px;
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
      max-height: calc(100% - 120px);
      max-height: calc(100% - 120px - constant(safe-area-inset-top));
      max-height: calc(100% - 120px - env(safe-area-inset-top));
      margin-top: 0;
    }
  }
  @media (max-width: 768px) {
    width: calc(55%);
    min-width: 250px;
  }

  margin: 10px;
  padding: 12px 15px 5px 15px;
  outline: none;

  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2), 0 1px 5px rgba(0, 0, 0, 0.1);
  background-color: ${colors.colorizedBackgroundColor};

  overflow: auto;
  overflow-x: hidden;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  /* -webkit-overflow-scrolling: touch; */

  transform: scale3d(1, 1, 1); /* switch on 3D acceleration for the panel */

  .grab-handle {
    display: none;
    border: none;
    outline: none;
  }

  @media (max-width: 512px) {
    width: 100%;
    min-width: 250px;
    margin: 10px 0 0 0;

    border-top: ${colors.colorizedBackgroundColor} 8px solid;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .grab-handle {
      display: block;
      position: sticky;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 10px;
      margin: -10px 0 -20px 0;
      padding: 15px;
      transform: translateZ(0);
      touch-action: none;
      background-color: transparent;
      &:before {
        display: block;
        position: absolute;
        margin: 0 auto;
        top: 0px;
        left: calc(50% - 20px);
        content: '';
        width: 44px;
        height: 5px;
        border-radius: 2.5px;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }

  p {
    line-height: 1.5;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .link-button {
    display: block;
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    border-radius: 4px;
    margin: 0 -10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    color: ${colors.linkColor};

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        background-color: ${colors.linkBackgroundColorTransparent};
      }
    }

    &:focus&:not(.primary-button) {
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    &:disabled {
      opacity: 0.15;
    }
  }

  button.link-button.full-width-button {
    width: calc(100% + 20px);
    text-align: left;
  }

  .primary-button {
    color: white;
    background-color: ${colors.linkColor};
    min-width: 8em;

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        background-color: ${hsl(colors.linkColor).brighter(0.2)};
      }
    }
    &:active {
      background-color: ${hsl(colors.linkColor).darker(0.2)};
    }

    &.focus-visible {
      box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
      transition: box-shadow 0.2s;
    }

    &[disabled] {
      opacity: 0.8;
      color: ${colors.neutralColor};
      pointer-events: none;
    }
  }

  .negative-button {
    color: ${hsl(colors.negativeColor).darker(1)};
    @media (hover), (-moz-touch-enabled: 0) {
      &:hover,
      &:focus {
        background-color: ${colors.negativeBackgroundColorTransparent};
      }
    }

    &:active {
      background-color: ${hsl(colors.negativeBackgroundColorTransparent).darker(1)};
    }

    &[disabled] {
      opacity: 0.8;
      color: ${colors.neutralColor};
      pointer-events: none;
    }
  }

  &.toolbar-hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

export default StyledToolbar;
