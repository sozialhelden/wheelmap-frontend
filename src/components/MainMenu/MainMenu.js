// @flow
import React, { Component } from 'react';
import { hsl } from 'd3-color';
import styled from 'styled-components';
import logo from '../../lib/Logo.svg';
import CloseIcon from '../icons/actions/Close';
import colors from '../../lib/colors';

type State = {
  isMenuVisible: boolean,
};

type Props = {
  className: string,
  onToggle: ((isMainMenuOpen: boolean) => void),
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


class MainMenu extends Component<Props, State> {
  props: Props;
  state: State = {
    isMenuVisible: false,
  };
  boundOnResize: (() => void);

  onResize() {
    if (window.innerWidth > 1024) {
      this.setState({ isMenuVisible: false });
      this.props.onToggle(false);
    }
  }

  constructor(props: Props) {
    super(props);
    this.boundOnResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.boundOnResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.boundOnResize);
  }

  toggleMenu() {
    const newState = !this.state.isMenuVisible;
    this.setState({
      isMenuVisible: newState,
    });

    this.props.onToggle(newState);
  }

  render() {
    const classList = [
      this.props.className,
      this.state.isMenuVisible ? 'is-open' : null,
      'main-menu',
    ].filter(Boolean);

    return (<nav className={classList.join(' ')}>
      <div className="home-link">
        <a href="/beta">
          <img alt="" className="logo" src={logo} />
        </a>
      </div>
      <div className="flexible-separator" />
      <a className="nav-link" href="https://travelable.info">Travel guide</a>
      <a className="nav-link" href="https://news.wheelmap.org/wheelmap-botschafter">Get involved</a>
      <a className="nav-link" href="https://news.wheelmap.org">News</a>
      <a className="nav-link" href="https://news.wheelmap.org/presse">Press</a>
      <a className="nav-link" href="https://news.wheelmap.org/kontakt">Contact</a>
      <a className="nav-link" href="https://news.wheelmap.org/imprint">Imprint</a>
      <a className="nav-link" href="https://news.wheelmap.org/faq">FAQ</a>
      <a className="nav-link add-place-link" href="/nodes/new">Add missing place</a>
      <button className="menu" onClick={() => this.toggleMenu()}>
        {this.state.isMenuVisible ? <CloseIcon /> : <MenuIcon />}
      </button>
    </nav>);
  }
}


const openMenuHoverColor = hsl(colors.primaryColor).brighter(1.4);
openMenuHoverColor.opacity = 0.5;

const StyledMainMenu = styled(MainMenu)`
  box-sizing: border-box;
  height: 50px;
  padding: 10px 5px 10px 20px;
  background-color: rgba(254, 254, 254, 0.95);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
  transition: height 0.3s ease-out;
  overflow: auto;

  .logo {
    height: 30px;
  }

  .flexible-separator {
    flex: 1;
  }

  > .nav-link {
    padding: 10px 16px;
    box-sizing: border-box;
    border-radius: 4px;

    &, &:visited {
      color: ${colors.darkLinkColor};
    }
    &:hover {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
    }
    &:active {
      color: ${colors.primaryColor};
      background-color: ${hsl(colors.primaryColor).brighter(1.7)};
    }
  }

  > .add-place-link {
    font-weight: 500;
    white-space: nowrap;
    &, &:visited {
      color: ${colors.primaryColor};
    }
    &:hover {
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
    outline: none;
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

  @media (max-width: 1024px) {
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

    > .nav-link {
      width: 50%;
      max-width: 200px;
      display: none;
      align-items: center;
    }

    > .home-link {
      width: 100%;
      a {
        display: inline-block;
      }
    }

    > .nav-link, > .home-link {
      height: 44px;
      padding: 5px 10px;
      box-sizing: border-box;
    }

    &.is-open {
      background-color: rgba(254, 254, 254, 0.9);
      height: auto;
      > .nav-link {
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
    > .nav-link {
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
