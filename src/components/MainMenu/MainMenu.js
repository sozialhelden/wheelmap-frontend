// @flow
import * as React from 'react';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import queryString from 'query-string';
import Logo from '../../lib/Logo';
import CloseIcon from '../icons/actions/Close';
import colors from '../../lib/colors';
import { getQueryParams } from '../../lib/queryParams';
import { t } from 'ttag';
import GlobalActivityIndicator from './GlobalActivityIndicator';
import { Dots } from 'react-activity';
import strings from './strings';
import { Link } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';

type State = {
  isMenuButtonVisible: boolean,
};

type Props = {
  className: string,
  onToggle: (isMainMenuOpen: boolean) => void,
  isOpen: boolean,
  isLocalizationLoaded: boolean,
  lat: string,
  lon: string,
  zoom: string,
  history: RouterHistory,
  activateFocusTrap: () => void,
  deactivateFocusTrap: () => void,
};

function MenuIcon(props) {
  return (
    <svg
      className="menu-icon"
      width="25px"
      height="18px"
      viewBox="0 0 25 18"
      version="1.1"
      alt="Toggle menu"
      {...props}
    >
      <g stroke="none" strokeWidth={1} fillRule="evenodd">
        <rect x="0" y="0" width="25" height="3" />
        <rect x="0" y="7" width="25" height="3" />
        <rect x="0" y="14" width="25" height="3" />
      </g>
    </svg>
  );
}

const menuButtonVisibilityBreakpoint = 1024;

class MainMenu extends React.Component<Props, State> {
  props: Props;
  state: State = {
    isMenuButtonVisible: window.innerWidth <= menuButtonVisibilityBreakpoint,
  };

  boundOnResize: () => void;

  onResize = () => {
    if (window.innerWidth > menuButtonVisibilityBreakpoint) {
      this.setState({ isMenuButtonVisible: false });
    } else {
      this.setState({ isMenuButtonVisible: true });
      this.props.onToggle(false);
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentDidUpdate() {
    this.updateFocusTrapActivation();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  toggleMenu = (event: Event) => {
    this.props.onToggle(!this.props.isOpen);
    event.preventDefault();
  };

  returnHome = () => {
    this.props.history.push({ pathname: '/beta' }, { isOnboardingVisible: true });
  };

  updateFocusTrapActivation = () => {
    const { isLocalizationLoaded, isOpen, activateFocusTrap, deactivateFocusTrap } = this.props;
    const { isMenuButtonVisible } = this.state;

    if (isLocalizationLoaded) {
      if (isOpen && isMenuButtonVisible) {
        activateFocusTrap();
      } else {
        deactivateFocusTrap();
      }
    }
  };

  handleKeyDown = (event: SyntheticEvent<HTMLElement>) => {
    if (event.nativeEvent.key === 'Escape') {
      this.props.onToggle(false);
    }
  };

  render() {
    const {
      travelGuide,
      getInvolved,
      news,
      press,
      contact,
      imprint,
      faq,
      addMissingPlace,
      findWheelchairAccessiblePlaces,
    } = strings();

    const { isLocalizationLoaded, isOpen, className } = this.props;
    const { isMenuButtonVisible } = this.state;

    const classList = [
      className,
      isOpen || !isMenuButtonVisible ? 'is-open' : null,
      isLocalizationLoaded ? 'is-loaded' : null,
      'main-menu',
    ].filter(Boolean);

    if (!isLocalizationLoaded) {
      return (
        <nav className={classList.join(' ')}>
          <div className="home-link">
            <button className="btn-unstyled home-button" disabled>
              <Logo className="logo" width={123} height={30} />
            </button>
          </div>
          <Dots />
        </nav>
      );
    }

    return (
      <nav className={classList.join(' ')}>
        <div className="home-link">
          <button
            className="btn-unstyled home-button"
            onClick={this.returnHome}
            aria-label={t`Home`}
            onKeyDown={this.handleKeyDown}
          >
            <Logo className="logo" width={123} height={30} />
          </button>
        </div>

        <div className="claim">{findWheelchairAccessiblePlaces}</div>

        <GlobalActivityIndicator />

        <div className="flexible-separator" />

        <button
          className="btn-unstyled menu"
          onClick={this.toggleMenu}
          aria-hidden={!isMenuButtonVisible}
          aria-label={t`Menu`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls="main-menu"
          onKeyDown={this.handleKeyDown}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div id="main-menu" role="menu">
          <a className="nav-link" href="https://travelable.info" role="menuitem">
            {travelGuide}
          </a>
          <a
            className="nav-link"
            href="https://news.wheelmap.org/wheelmap-botschafter"
            role="menuitem"
          >
            {getInvolved}
          </a>
          <a className="nav-link" href="https://news.wheelmap.org" role="menuitem">
            {news}
          </a>
          <a className="nav-link" href="https://news.wheelmap.org/presse" role="menuitem">
            {press}
          </a>
          <a className="nav-link" href="https://news.wheelmap.org/kontakt" role="menuitem">
            {contact}
          </a>
          <a className="nav-link" href="https://news.wheelmap.org/imprint" role="menuitem">
            {imprint}
          </a>
          <a className="nav-link" href="https://news.wheelmap.org/faq" role="menuitem">
            {faq}
          </a>
          <Link
            className="nav-link add-place-link"
            to={`/beta/nodes/new?${queryString.stringify(getQueryParams())}`}
            role="menuitem"
          >
            {addMissingPlace}
          </Link>
        </div>
      </nav>
    );
  }
}

const openMenuHoverColor = hsl(colors.primaryColor).brighter(1.4);
openMenuHoverColor.opacity = 0.5;

const StyledMainMenu = styled(MainMenu)`
  box-sizing: border-box;
  padding: 0;
  background-color: rgba(254, 254, 254, 0.95);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25), 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .logo {
    height: 30px;
    margin-left: 10px;
  }

  .claim {
    font-weight: lighter;
    opacity: 0.6;
    transition: opacity 0.3s ease-out;
    @media (max-width: 1280px) {
      font-size: 80%;
      max-width: 130px;
    }
    @media (max-width: 1160px) {
      opacity: 0;
    }
    @media (max-width: 1140px) {
      display: none;
    }
  }

  .flexible-separator {
    flex: 1;
  }

  #main-menu {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  &.is-open {
    #main-menu {
      opacity: 1;
    }
  }

  .nav-link {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 4px;

    &,
    &:visited {
      color: ${colors.darkLinkColor};
    }
    &:hover,
    &:focus {
      color: ${colors.linkColorDarker};
      background-color: ${colors.linkBackgroundColorTransparent};
    }
    &:active {
      color: ${colors.linkColor};
      background-color: ${hsl(colors.linkColor).brighter(1.7)};
    }
  }

  .add-place-link {
    font-weight: 500;
    &,
    &:visited {
      color: ${colors.linkColor};
    }
  }

  button.btn-unstyled {
    border: none;
    background: transparent;
    cursor: pointer;
    margin: 0;
    padding: 0;
    min-width: 50px;
    min-height: 50px;
  }

  button.menu {
    position: fixed;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    right: 0;
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
    width: 70px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;

    svg {
      margin: auto;
    }
    svg g {
      fill: ${colors.darkLinkColor};
      transition: fill 0.1s ease-out;
    }
    &:hover {
      background-color: ${colors.linkBackgroundColorTransparent};
      svg g {
        fill: ${colors.linkColor};
      }
    }
    &:active {
      background-color: ${colors.linkBackgroundColorTransparent};
      svg g {
        fill: ${colors.darkLinkColor};
      }
    }
  }

  @media (max-width: ${menuButtonVisibilityBreakpoint}px) {
    position: absolute;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    right: 0;

    flex-wrap: wrap;

    #main-menu {
      padding-bottom: 0.5rem;
    }

    button.menu {
      opacity: 1;
      pointer-events: inherit;
    }

    .flexible-separator {
      display: none;
    }

    .home-button {
      padding-left: 1em;
    }

    .nav-link {
      height: 44px;
      padding-left: 1em;
      width: 50%;
      max-width: 240px;
      display: none;
      align-items: center;
      box-sizing: border-box;
    }

    &.is-open {
      .nav-link {
        display: flex;
      }

      button.menu {
        svg {
          width: 16px;
          height: 16px;
        }
        svg g {
          fill: ${colors.primaryColor};
        }
        &:hover {
          background-color: ${openMenuHoverColor};
          svg g {
            fill: ${hsl(colors.primaryColor).darker(1)};
          }
        }
        &:active {
          background-color: ${openMenuHoverColor};
          svg g {
            color: ${hsl(openMenuHoverColor).darker(2)};
          }
        }
      }
    }
  }

  @media (max-width: 400px) {
    .nav-link {
      width: 100%;
      max-width: 100%;
    }
  }

  @media (max-height: 400px) {
    padding: 2px 10px 2px 10px;
    padding-left: constant(safe-area-inset-left);
    padding-left: env(safe-area-inset-left);
    &,
    button.menu {
      height: 44px;
    }
    &.is-open {
      height: auto;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:not(.is-loaded) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    .rai-activity-indicator {
      margin-right: 20px;
    }
  }

  &.is-loaded {
    > *:not(.home-link):not(.logo) {
      animation: fadeIn 1s ease-out;
    }
  }
`;

export default StyledMainMenu;
