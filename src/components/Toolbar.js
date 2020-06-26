// @flow
import { t } from 'ttag';
import { hsl } from 'd3-color';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import Swipeable from 'react-swipeable';
import * as React from 'react';
import colors from '../lib/colors';
import { isOnSmallViewport } from '../lib/ViewportSize';
import * as safeAreaInsets from 'safe-area-insets';
import Measure from 'react-measure';

type Props = {
  className?: string,
  children: React.Node,
  hidden?: boolean,
  inert?: boolean,
  role?: string,
  ariaLabel?: string,
  ariaDescribedBy?: string,
  minimalHeight?: number,
  minimalTopPosition?: number,
  isSwipeable?: boolean,
  isModal?: boolean,
  enableTransitions?: boolean,
  onScrollable?: (isScrollable: boolean) => void,
};

type State = {
  dimensions?: {
    width: number,
    height: number,
  },
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
 * A toolbar that shows as a card that you can swipe up and down on small viewports,
 * and that has a fixed position on bigger viewports.
 *
 * Automatically becomes scrollable when fully visible.
 *
 * When dragged with a swipe gesture, it transitions smoothly between expanding/collapsing
 * and scrolling its content.
 *
 * Can be modal and is not swipeable then.
 */

class Toolbar extends React.Component<Props, State> {
  static defaultProps = {
    hidden: false,
    minimalHeight: 90,
    isSwipeable: true,
    isModal: false,
    role: '',
    enableTransitions: true,
  };

  props: Props;

  ensureVisibilityTimeoutId: ?number;

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
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  componentDidMount() {
    this.onResize();
    if (this.props.isModal) this.ensureFullVisibility();
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.isModal !== this.props.isModal) {
      this.ensureFullVisibility();
    }
  }

  /** Moves the toolbar to show as much of its content as possible. */
  ensureFullVisibility() {
    if (typeof window !== 'undefined') {
      if (this.ensureVisibilityTimeoutId) {
        window.clearTimeout(this.ensureVisibilityTimeoutId);
      }
      this.ensureVisibilityTimeoutId = window.setTimeout(() => {
        this.ensureVisibilityTimeoutId = undefined;
        this.setState({ topOffset: 0 });
        this.onResize();
      }, 150);
    }
  }

  onResize(preferredTopOffset: number = this.state.topOffset) {
    const viewportSize = {
      width: typeof window === 'undefined' ? 1024 : window.innerWidth,
      height: typeof window === 'undefined' ? 768 : window.innerHeight,
    };

    const topOffset = this.getNearestStopForTopOffset(preferredTopOffset);
    this.setState({
      viewportSize,
      topOffset,
      lastTopOffset: topOffset,
    });
  }

  onSwiping(e: TouchEvent, deltaX: number, deltaY: number) {
    console.log('deltaY', deltaY);
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

    const touchTopOffset = this.state.lastTopOffset - deltaY - this.state.scrollTop;
    const topOffset = Math.max(0, touchTopOffset);

    if (this.scrollElement && touchTopOffset < 0) {
      this.scrollElement.scrollTop = -touchTopOffset;
      console.log('scrollTop:', this.scrollElement.scrollTop);
    }

    this.setState({ isSwiping: true });
    this.setState({ topOffset });
    if (topOffset === 0) {
      this.setState({ lastTopOffset: 0 });
    }
  }

  onSwiped(e: TouchEvent, deltaX: number, deltaY: number, isFlick: boolean) {
    if (!this.props.isSwipeable || this.props.isModal) {
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

  getMinimalTopPosition(): number {
    return (
      (typeof window !== 'undefined' ? safeAreaInsets.top : 0) + this.props.minimalTopPosition || 0
    );
  }

  getToolbarHeight(): number {
    return Math.round(this.state.dimensions ? this.state.dimensions.height : 0);
  }
  /** @returns the maximal top position for the toolbar to stay interactable. */

  /** @returns An array of top position offsets that the toolbar is allowed to stop on. */

  getStops(): number[] {
    const toolbarHeight = this.getToolbarHeight();

    // On landscape phones, the toolbar is fixed on the left side.
    if (this.isLandscapePhone()) {
      return [0];
    }
    // The toolbar needs a minimal height be draggable from the bottom when minimized
    const minimalHeight = Math.max(this.props.minimalHeight || 0, 90);
    const bottomPosition = toolbarHeight - minimalHeight;

    // Define 3 default stop positions
    const stops = uniq([0, bottomPosition]);

    return stops;
  }

  isFullyExpanded() {
    const stops = this.getStops();
    return (this.state.topOffset || this.state.lastTopOffset) === stops[0];
  }

  isAtTopmostPosition() {
    return (this.state.topOffset || this.state.lastTopOffset) <= 0;
  }

  isLandscapePhone() {
    return isOnSmallViewport() && this.state.viewportSize.width > this.state.viewportSize.height;
  }

  getStyle(): { transform: string, touchAction: string, transition: string, overflowY: string } {
    const lastTopOffset = this.state.lastTopOffset;

    const isToolbarFittingOnScreenCompletely =
      this.state.viewportSize.height - this.getToolbarHeight() - this.getStops()[0] > 0;
    const isBigViewport =
      this.state.viewportSize.width > 512 && this.state.viewportSize.height > 512;
    let topOffset = this.state.topOffset || lastTopOffset;
    if (isBigViewport && isToolbarFittingOnScreenCompletely) {
      topOffset = 0;
    } else {
      // topOffset = Math.max(0, topOffset);
    }

    const defaultTransitions = 'opacity 0.3s ease-out';
    const isSwiping = this.state.isSwiping;
    const { enableTransitions } = this.props;
    const isAtTopmostPosition = this.isAtTopmostPosition();
    return {
      touchAction: isAtTopmostPosition ? 'inherit' : 'none',
      overflowY: isAtTopmostPosition ? 'auto' : 'hidden',
      transition: enableTransitions
        ? isSwiping
          ? defaultTransitions
          : `${defaultTransitions}, transform 0.3s ease-out`
        : '',
      transform: `translate3d(0, ${topOffset}px, 0)`,
    };
  }

  cancelTouchIfMoving = (event: TouchEvent) => {
    const scrollElementHasMoreContentThanShown =
      !!this.scrollElement && this.scrollElement.scrollHeight > this.scrollElement.clientHeight;
    const isScrollable = this.isAtTopmostPosition() && scrollElementHasMoreContentThanShown;
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
      this.isAtTopmostPosition() ? 'toolbar-is-at-top' : null,
      this.props.className,
    ];
    const className = classNames.filter(Boolean).join(' ');

    return (
      <Measure
        bounds
        onResize={contentRect => {
          if (!isEqual(contentRect.bounds, this.state.dimensions)) {
            this.setState({ dimensions: contentRect.bounds }, () => {
              this.ensureFullVisibility();
            });
          }
        }}
      >
        {({ measureRef }) => (
          <Swipeable
            onSwiping={(e, deltaX, deltaY) => this.onSwiping(e, deltaX, deltaY)}
            onSwiped={(e, deltaX, deltaY, isFlick) => this.onSwiped(e, deltaX, deltaY, isFlick)}
          >
            <section
              className={className}
              style={this.getStyle()}
              ref={nav => {
                // Without this check, the toolbar would re-render every frame.
                // https://github.com/souporserious/react-measure/issues/90#issuecomment-479679303
                if (!this.scrollElement) {
                  measureRef(nav);
                  this.scrollElement = nav;
                }
              }}
              aria-hidden={this.props.inert || this.props.hidden}
              role={this.props.role}
              aria-label={this.props.ariaLabel}
              aria-describedby={this.props.ariaDescribedBy}
              data-minimal-top-position={this.props.minimalTopPosition}
              data-last-top-offset={this.state.lastTopOffset}
              data-dimensions-viewport-height={
                this.state.viewportSize && this.state.viewportSize.height
              }
              data-dimensions-height={this.state.dimensions && this.state.dimensions.height}
              data-stops={this.getStops().toString()}
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

                      // reset scroll position
                      if (this.scrollElement) {
                        this.scrollElement.scrollTop = 0;
                      }
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
        )}
      </Measure>
    );
  }
}

const StyledToolbar = styled(Toolbar)`
  position: fixed;
  overscroll-behavior-y: contain;
  touch-action: pan-y;

  user-select: none;
  -webkit-user-drag: none;

  /* Positioning */
  left: 0;
  left: constant(safe-area-inset-left);
  left: env(safe-area-inset-left);

  /* Sizing (more sizing for different viewports below) */
  box-sizing: border-box;
  width: 320px;
  min-width: 320px;
  max-height: calc(100% - ${p => p.minimalTopPosition || 0}px);
  max-height: calc(100% - ${p => p.minimalTopPosition || 0}px - constant(safe-area-inset-top));
  max-height: calc(100% - ${p => p.minimalTopPosition || 0}px - env(safe-area-inset-top));

  @media (max-height: 512px), (max-width: 512px) {
    bottom: 0;
  }

  &.toolbar-is-modal {
    z-index: 1000;

    @media (max-height: 512px), (max-width: 512px) {
      margin-bottom: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }

    @media (min-width: 513px) and (min-height: 513px) {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
    }
  }

  margin: 10px;
  padding: 0px 15px 5px 15px;
  outline: none;
  border-top: ${colors.colorizedBackgroundColor} 8px solid;
  padding-bottom: 8px;

  border-radius: 9px;
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
    margin: 0;
    .grab-handle {
      display: block;
      position: sticky;
      top: 0;
      left: 50%;
      z-index: 3;
      width: 50%;
      height: 10px;
      margin: -10px 0 -20px 0;
      padding: 15px;
      transform: translateZ(0) translateX(-50%);
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
    margin: 0 -8px;
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
