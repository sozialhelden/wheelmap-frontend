import { hsl } from 'd3-color';
import FocusTrap from 'focus-trap-react';
import Link from 'next/link';
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';
import colors, { alpha } from '../../../lib/colors';
import { translatedStringFromObject } from '../../../lib/i18n';
import { ClientSideConfiguration } from '../../../lib/model/ClientSideConfiguration';
import CloseIcon from '../../icons/actions/Close';
import VectorImage from '../../shared/VectorImage';
import AppLinks from './AppLinks';

type State = {
  isMenuButtonVisible: boolean,
};

type Props = {
  onToggle: (isMainMenuOpen: boolean) => void,
  isOpen: boolean,
  clientSideConfiguration: ClientSideConfiguration,
  className?: string,
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

const MENU_BUTTON_VISIBILITY_BREAKPOINT = 1024;


const openMenuHoverColor = hsl(colors.primaryColor).brighter(1.4);
openMenuHoverColor.opacity = 0.5;

const StyledNav = styled.nav`
  box-sizing: border-box;
  padding: 0;
  background-color: rgba(254, 254, 254, 0.9);
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 0 20px ${alpha(colors.darkLinkColor, 0.25)},
    0 1px 5px ${alpha(colors.darkLinkColor, 0.1)};
  overflow: hidden;

  .logo {
    margin-left: 10px;
    margin-right: 10px;
    object-fit: contain;
    object-position: left;
  }

  .claim {
    font-weight: 300;
    opacity: 0.6;
    transition: opacity 0.3s ease-out;
    padding-left: 5px;
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: center;

    @media (max-width: 1280px) {
      font-size: 80%;
    }
    @media (max-width: 1180px) {
      display: none;
    }
  }

  #main-menu {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
    height: 100%;
    overflow: hidden;
    flex: 3;
    min-height: 50px;
  }

  &.is-open {
    #main-menu {
      opacity: 1;
    }
  }

  .nav-link {
    padding: 2px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    &,
    &:visited {
      color: ${colors.darkLinkColor};
    }
    &:hover,
    &:focus {
      color: ${colors.linkColorDarker};
      background-color: ${colors.linkBackgroundColorTransparent};
      box-shadow: 0 1px 20px ${colors.linkBackgroundColorTransparent};
    }
    &:active {
      color: ${colors.linkColor};
      background-color: ${hsl(colors.linkColor)
        .brighter(1.7)
        .toString()};
    }
  }

  .primary-link {
    font: inherit;
    border: 0;
    margin: 0;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;

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

  position: absolute;
  top: 0;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  backdrop-filter: blur(5px);
  left: 0;
  right: 0;

  @media (max-width: ${MENU_BUTTON_VISIBILITY_BREAKPOINT}px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    background-color: rgba(254, 254, 254, 0.9);
    backdrop-filter: blur(5px);

    #main-menu {
      justify-content: space-between;
      min-height: 0;
    }

    .activity-indicator {
      position: fixed;
      top: 0;
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
      right: 0;
      right: constant(safe-area-inset-right);
      right: env(safe-area-inset-right);
      margin-right: 80px;
      margin-top: 20px;
    }

    button.menu {
      opacity: 1;
      pointer-events: inherit;
    }

    .flexible-separator {
      display: none;
    }

    .nav-link {
      display: none;
      box-sizing: border-box;
      align-items: center;
      height: 44px;
      padding: 8px;
      width: calc(50% - 16px);
      border-radius: 4px;
      text-align: center;
      background-color: white;
      box-shadow: 0 1px 2px ${alpha(colors.darkLinkColor, 0.1)},
        0 2px 9px ${alpha(colors.darkLinkColor, 0.07)};
      &:focus {
        box-shadow: 0 0px 0px 2px ${alpha(colors.linkColor, 0.7)},
          0 2px 9px ${alpha(colors.darkLinkColor, 0.07)};
      }
    }

    &.is-open {
      .nav-link {
        display: flex;
        margin: 8px;
      }

      #main-menu {
        margin: 16px;
        align-self: flex-end;
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
          background-color: ${openMenuHoverColor.toString()};
          svg g {
            fill: ${hsl(colors.primaryColor)
              .darker(1)
              .toString()};
          }
        }
        &:active {
          background-color: ${openMenuHoverColor.toString()};
          svg g {
            color: ${hsl(openMenuHoverColor)
              .darker(2)
              .toString()};
          }
        }
      }
    }
  }

  @media (max-height: 400px) {
    padding: 2px 10px 2px 10px;
    padding-left: constant(safe-area-inset-left);
    padding-left: env(safe-area-inset-left);
    &,
    button.menu,
    button.home-button {
      height: 44px;
      min-height: auto;
    }
    &.is-open {
      height: auto;
    }
  }
`;


export default class MainMenu extends React.Component<Props, State> {
  props: Props;
  state: State = {
    isMenuButtonVisible: false,
  };

  boundOnResize: () => void;

  onResize = () => {
    if (window.innerWidth > MENU_BUTTON_VISIBILITY_BREAKPOINT) {
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

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }

  toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onToggle(!this.props.isOpen);
    event.preventDefault();
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      this.props.onToggle(false);
    }
  };

  renderHomeLink(extraProps = {}) {
    const productName =
      translatedStringFromObject(this.props.clientSideConfiguration.textContent?.product.name) ||
      'Wheelmap';
    return (
      <div className="home-link">
        <Link href='/onboarding'>
          <button
            className="btn-unstyled home-button"
            aria-label={t`Home`}
            onKeyDown={this.handleKeyDown}
            {...extraProps}
          >
            <VectorImage
              className="logo"
              svg={this.props.clientSideConfiguration.branding?.vectorLogoSVG}
              aria-label={productName}
              maxHeight={'30px'}
              maxWidth={'150px'}
              hasShadow={false}
            />
          </button>
        </Link>
      </div>
    );
  }

  renderAppLinks(baseUrl: string) {

  }


  renderCloseButton() {
    const { isOpen } = this.props;
    const { isMenuButtonVisible } = this.state;
    return (
      <button
        className="btn-unstyled menu"
        onClick={this.toggleMenu}
        aria-hidden={!isMenuButtonVisible}
        tabIndex={isMenuButtonVisible ? 0 : -1}
        aria-label={t`Menu`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="main-menu"
        onKeyDown={this.handleKeyDown}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    );
  }

  render() {
    const { isOpen, className, clientSideConfiguration } = this.props;
    const claim = translatedStringFromObject(clientSideConfiguration?.textContent?.product?.claim);
    const { isMenuButtonVisible } = this.state;

    const classList = [
      className,
      isOpen || !isMenuButtonVisible ? 'is-open' : null,
      'main-menu',
    ].filter(Boolean);

    const focusTrapIsActive = isMenuButtonVisible && isOpen;

    return (
      <FocusTrap active={focusTrapIsActive}>
        <StyledNav className={classList.join(' ')}>
          {this.renderHomeLink()}

          <div className="claim">{claim}</div>

          <div id="main-menu" role="menu">
            <AppLinks />
          </div>

          {this.renderCloseButton()}
        </StyledNav>
      </FocusTrap>
    );
  }
}


