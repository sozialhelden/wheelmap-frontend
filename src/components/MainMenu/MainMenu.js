// @flow
import * as React from 'react';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import Logo from '../../lib/Logo';
import CloseIcon from '../icons/actions/Close';
import colors from '../../lib/colors';
import GlobalActivityIndicator from './GlobalActivityIndicator';
import strings from './strings';


type State = {
  isMenuVisible: boolean,
  isMenuButtonVisible: boolean,
};

type Props = {
  className: string,
  onToggle: ((isMainMenuOpen: boolean) => void),
  isEditMode: boolean,
};


function MenuIcon(props) {
  return (<svg className="menu-icon" width="25px" height="18px" viewBox="0 0 25 18" version="1.1" alt="Toggle menu" {...props}>
    <g stroke="none" strokeWidth={1} fillRule="evenodd">
      <rect x="0" y="0" width="25" height="3" />
      <rect x="0" y="7" width="25" height="3" />
      <rect x="0" y="14" width="25" height="3" />
    </g>
  </svg>);
}

const menuButtonVisibilityBreakpoint = 1024;

class MainMenu extends React.Component<Props, State> {
  props: Props;
  state: State = {
    isMenuVisible: false,
    isMenuButtonVisible: window.innerWidth <= menuButtonVisibilityBreakpoint,
  };
  boundOnResize: (() => void);

  onResize() {
    if (window.innerWidth > menuButtonVisibilityBreakpoint) {
      this.setState({ isMenuVisible: false, isMenuButtonVisible: false });
      this.props.onToggle(false);
    } else {
      this.setState({ isMenuButtonVisible: true });
    }
  }

  constructor(props: Props) {
    super(props);
    this.boundOnResize = this.onResize.bind(this);
    this.focusToLastElement = this.focusToLastElement.bind(this);
    this.focusToFirstElement = this.focusToFirstElement.bind(this);
    this.focusFirstMenuElement = this.focusFirstMenuElement.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.boundOnResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.boundOnResize);
  }

  componentDidUpdate(_, prevState) {
    if (this.state.isMenuVisible) {
      this.setupFocusTrap()

      if (!prevState.isMenuVisible) {
        this.focusFirstMenuElement();
      }
    } else {
      this.tearDownFocusTrap();
    }
  }

  toggleMenu() {
    const newState = !this.state.isMenuVisible;
    this.setState({
      isMenuVisible: newState,
    });

    this.props.onToggle(newState);
  }

  setupFocusTrap() {
    this.homeLink.addEventListener('keydown', this.focusToLastElement);
    this.addPlaceLink.addEventListener('keydown', this.focusToFirstElement);
  }

  tearDownFocusTrap() {
    this.homeLink.removeEventListener('keydown', this.focusToLastElement);
    this.addPlaceLink.removeEventListener('keydown', this.focusToFirstElement);
  }

  focusToFirstElement(event) {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      this.homeLink.focus();
    }
  }

  focusToLastElement(event) {
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      this.addPlaceLink.focus();
    }
  }

  focusFirstMenuElement() {
    this.firstMenuElement.focus();
  }

  render() {
    const classList = [
      this.props.className,
      this.state.isMenuVisible ? 'is-open' : null,
      'main-menu',
    ].filter(Boolean);


    const {
      travelGuide, getInvolved, news, press, contact, imprint, faq, addMissingPlace, findWheelchairAccessiblePlaces,
    } = strings();

    const { isEditMode } = this.props;

    return (<nav className={classList.join(' ')}>
      <div className="home-link">
        <a href="/beta" ref={homeLink => this.homeLink = homeLink} tabIndex={isEditMode ? -1 : 0} aria-label={`Home`}>
          <Logo className="logo" width={123} height={30} />
        </a>
      </div>

      <div className="claim">
        {findWheelchairAccessiblePlaces}
      </div>

      <GlobalActivityIndicator />

      <div className="flexible-separator" />

      <button
        className="menu"
        onClick={() => this.toggleMenu()}
        tabIndex={this.state.isMenuButtonVisible ? 0 : -1}
        aria-hidden={!this.state.isMenuButtonVisible}
        aria-label={`Menü`}
        aria-haspopup="true"
        aria-expanded={this.state.isMenuVisible}
        aria-controls="main-menu"
      >
        {this.state.isMenuVisible ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div id="main-menu" role="menu">
        <a
          className="nav-link"
          href="https://travelable.info"
          ref={firstMenuElement => this.firstMenuElement = firstMenuElement}
          tabIndex={isEditMode ? -1 : 0}
          role="menuitem"
        >
          {travelGuide}
        </a>
        <a className="nav-link" href="https://news.wheelmap.org/wheelmap-botschafter" tabIndex={isEditMode ? -1 : 0} role="menuitem" >
          {getInvolved}
        </a>
        <a className="nav-link" href="https://news.wheelmap.org" tabIndex={isEditMode ? -1 : 0} role="menuitem" >{news}</a>
        <a className="nav-link" href="https://news.wheelmap.org/presse" tabIndex={isEditMode ? -1 : 0} role="menuitem" >{press}</a>
        <a className="nav-link" href="https://news.wheelmap.org/kontakt" tabIndex={isEditMode ? -1 : 0} role="menuitem" >{contact}</a>
        <a className="nav-link" href="https://news.wheelmap.org/imprint" tabIndex={isEditMode ? -1 : 0} role="menuitem" >{imprint}</a>
        <a className="nav-link" href="https://news.wheelmap.org/faq" tabIndex={isEditMode ? -1 : 0} role="menuitem" >{faq}</a>
        <a
          className="nav-link add-place-link"
          href="/nodes/new"
          ref={addPlaceLink => this.addPlaceLink = addPlaceLink}
          tabIndex={isEditMode ? -1 : 0}
          role="menuitem"
        >
          {addMissingPlace}
        </a>
      </div>
    </nav>);
  }
}

const openMenuHoverColor = hsl(colors.primaryColor).brighter(1.4);
openMenuHoverColor.opacity = 0.5;

const StyledMainMenu = styled(MainMenu)`
  box-sizing: border-box;
  height: 50px;
  padding: 9px 5px 11px 20px;
  background-color: rgba(254, 254, 254, 0.95);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
  transition: height 0.3s ease-out;
  overflow: auto;

  .home-link {
    margin-right: 1em;

    a {
      display: inline-block;
    }
  }

  .logo {
    height: 30px;
  }

  .claim {
    font-weight: lighter;
    opacity: 0.4;
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
    align-items: flex-start;
    justify-content: space-between;
  }

  .nav-link {
    padding: 10px 16px;
    box-sizing: border-box;
    border-radius: 4px;

    &, &:visited {
      color: ${colors.darkLinkColor};
    }
    &:hover, &:focus {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
    }
    &:active {
      color: ${colors.primaryColor};
      background-color: ${hsl(colors.primaryColor).brighter(1.7)};
    }
  }

  .add-place-link {
    font-weight: 500;
    white-space: nowrap;
    &, &:visited {
      color: ${colors.primaryColor};
    }
    &:hover, &:focus {
      color: ${hsl(colors.primaryColor).darker(1)};
      background-color: ${hsl(colors.primaryColor).brighter(1.7)};
    }
    &:active {
      color: ${hsl(colors.primaryColor).darker(2)};
    }
  }

  button.menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 60px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
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
    left: 0;
    right: 0;
    padding: 5px 10px 10px 10px;

    flex-wrap: wrap;
    align-items: flex-start;

    button.menu {
      opacity: 1;
      pointer-events: inherit;
    }

    .flexible-separator {
      display: none;
    }

    .nav-link {
      width: 50%;
      max-width: 220px;
      display: none;
      align-items: center;
    }

    .home-link {
      width: 100%;
      a {
        display: inline-block;
      }
    }

    .nav-link, .home-link {
      height: 44px;
      padding: 2px 10px;
      box-sizing: border-box;
    }

    &.is-open {
      background-color: rgba(254, 254, 254, 0.9);
      height: auto;
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
    padding: 2px 10px 10px 5px;
    &, button.menu {
      height: 44px;
    }
  }
`;

export default StyledMainMenu;
