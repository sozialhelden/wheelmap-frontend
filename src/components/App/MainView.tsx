import uniq from "lodash/uniq";
import * as React from "react";
import styled from "styled-components";
import colors from "../../lib/colors";
import config from "../../lib/config";
import { isTouchDevice } from "../../lib/userAgent";
import { hasBigViewport, isOnSmallViewport } from "../../lib/ViewportSize";
import ErrorBoundary from "../ErrorBoundary";
import FullscreenBackdrop from "./Layout/FullscreenBackdrop";
import MainMenu from "./MainMenu/MainMenu";
import NodeToolbarFeatureLoader from "../NodeToolbar/NodeToolbarFeatureLoader";
import PhotoUploadInstructionsToolbar from "../PhotoUpload/PhotoUploadInstructionsToolbar";
import SearchButton from "../SearchToolbar/SearchButton";
import SearchToolbar from "../SearchToolbar/SearchToolbar";
import { DynamicMap } from "./DynamicMap";
import { EmbedModeOpenAppInNewTabLink } from "./EmbedModeOpenAppInNewTabLink";

type Props = {
  className?: string;
  isMainMenuOpen: boolean;
  isSearchBarVisible: boolean;
  isSearchToolbarExpanded: boolean;
  isSearchButtonVisible: boolean;
  shouldLocateOnStart: boolean;
  onMoveEnd: () => void;
  onMapClick: () => void;
};

type State = {
  isOnSmallViewport: boolean;
};

function updateTouchCapability() {
  const body = document.body;
  if (!body) return;

  if (isTouchDevice()) {
    body.classList.add("is-touch-device");
  } else {
    body.classList.remove("is-touch-device");
  }
}

class MainView extends React.Component<Props, State> {
  props: Props;

  state: State = {
    isOnSmallViewport: isOnSmallViewport(),
  };

  map: { focus: () => void; snapToFeature: () => void } | null;
  lastFocusedElement: HTMLElement | null;
  nodeToolbar: NodeToolbarFeatureLoader | null;
  searchToolbar: SearchToolbar | null;
  photoUploadInstructionsToolbar: PhotoUploadInstructionsToolbar | null;

  resizeListener = () => {
    updateTouchCapability();
    this.updateViewportSizeState();
  };

  componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resizeListener);
    }
    this.resizeListener();
  }

  componentWillUnmount() {
    delete this.resizeListener;
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.resizeListener);
    }
  }

  updateViewportSizeState() {
    this.setState({ isOnSmallViewport: isOnSmallViewport() });
  }

  focusSearchToolbar() {
    if (this.searchToolbar) {
      this.searchToolbar.focus();
    }
  }

  focusMap() {
    if (this.map) {
      this.map.focus();
    }
  }

  onClickCurrentMarkerIcon = () => {
    if (this.map) {
      this.map.snapToFeature();
    }
  };

  onMappingEventHeaderClick = () => {
    this.map && this.map.snapToFeature();
  };

  getMinimalNodeToolbarTopPosition() {
    return this.props.inEmbedMode
      ? this.state.isOnSmallViewport
        ? 92
        : 0
      : 120;
  }

  getMinimalToolbarTopPosition() {
    return this.props.inEmbedMode
      ? this.state.isOnSmallViewport
        ? 92
        : 0
      : this.state.isOnSmallViewport
      ? 50
      : 60;
  }

  renderSearchButton() {
    return (
      <SearchButton
        onClick={(event) => {
          event.stopPropagation();
          // Using setTimeout to prevent touch-up events from hovering components
          // in the search toolbar
          setTimeout(() => this.props.onClickSearchButton(), 10);
        }}
        category={this.props.category}
        toiletFilter={this.props.toiletFilter}
        accessibilityFilter={this.props.accessibilityFilter}
      />
    );
  }

  renderMainMenu() {
    return (
      <MainMenu
        className="main-menu"
        isOpen={this.props.isMainMenuOpen}
        onToggle={this.props.onToggleMainMenu}
      />
    );
  }

  getMapPadding() {}

  renderFullscreenBackdrop() {
    const isActive = props.isMainMenuOpen || props.hasBlurredBackdrop;

    return (
      <FullscreenBackdrop
        onClick={props.onClickFullscreenBackdrop}
        isActive={isActive}
      />
    );
  }

  renderMap() {
    return (
      <DynamicMap
        forwardedRef={(map) => {
          this.map = map;
          if (typeof window !== "undefined") {
            // @ts-ignore
            window.map = map;
          }
        }}
        onMoveEnd={this.props.onMoveEnd}
        onClick={this.props.onMapClick}
        onMarkerClick={this.props.onMarkerClick}
        onClusterClick={this.props.onClusterClick}
        onMappingEventClick={this.props.onMappingEventClick}
        onError={this.props.onError}
        activeCluster={this.props.activeCluster}
        locateOnStart={this.props.shouldLocateOnStart}
        padding={this.getMapPadding()}
        hideHints={
          this.state.isOnSmallViewport &&
          (isNodeToolbarVisible || this.props.isMainMenuOpen)
        }
        inEmbedMode={inEmbedMode}
        {...config}
      />
    );
  }

  renderWheelmapHomeLink() {
    if (typeof window !== "undefined") {
      return;
    }
  }

  render() {
    const {
      className,
      isMainMenuOpen,
      isSearchBarVisible,
      isSearchButtonVisible,
    } = this.props;
    const isMainMenuInBackground = isDialogVisible;
    const classList = uniq([
      "main-view",
      className,
      isDialogVisible ? "is-dialog-visible" : null,
      isMainMenuOpen ? "is-main-menu-open" : null,
      isSearchBarVisible ? "is-search-bar-visible" : null,
      modalNodeState ? "is-modal" : null,
      useEmbedModeFlag() ? "in-embed-mode" : null,
    ]).filter(Boolean);

    return (
      <StyledDiv className={classList.join(" ")}>
        {!inEmbedMode && !isMainMenuInBackground && this.renderMainMenu()}
        <ErrorBoundary>
          <div className="behind-backdrop">
            {inEmbedMode && <EmbedModeOpenAppInNewTabLink />}
            {!inEmbedMode && isMainMenuInBackground && this.renderMainMenu()}
            {!inEmbedMode && this.renderSearchToolbar()}
            {!inEmbedMode && isSearchButtonVisible && this.renderSearchButton()}
            {this.renderMap()}
          </div>
          {this.renderFullscreenBackdrop()}
        </ErrorBoundary>
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }

  > * {
    transition: transform 0.3s ease-out, opacity 0.1s ease-out;
  }

  > .rai-activity-indicator {
    display: inline-block;
    font-size: 36px;
    line-height: 0;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  > .behind-backdrop {
    .toolbar {
      z-index: 1001;
    }
  }

  &.is-dialog-visible,
  &.is-modal,
  &.is-main-menu-open {
    > .behind-backdrop {
      border-radius: 30px;
      overflow: hidden;
      filter: blur(15px);
      .toolbar {
        z-index: 999;
      }
      transform: scale3d(0.99, 0.99, 1);
      @media (max-width: 512px), (max-height: 512px) {
        transform: scale3d(0.9, 0.9, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        transform: scale3d(1, 1, 1);
      }
      &,
      * {
        pointer-events: none;
      }
    }
  }

  &.is-modal {
    .node-toolbar,
    .toolbar {
      z-index: 1001;
    }
  }

  &.is-main-menu-open {
    > .main-menu {
      z-index: 1001;
    }
  }
`;
