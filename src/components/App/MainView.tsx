
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


  resizeListener = () => {
    updateTouchCapability();
    this.updateViewportSizeState();
  };

  updateViewportSizeState() {
    this.setState({ isOnSmallViewport: isOnSmallViewport() });
  }

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

  renderWheelmapHomeLink() {
    if (typeof window !== "undefined") {
      return;
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
