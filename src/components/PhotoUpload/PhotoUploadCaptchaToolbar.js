// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import ChevronRight from '../ChevronRight';

import colors from '../../lib/colors';

export type Props = {
  hidden: boolean,
  onClose: ?(() => void),
  onCompleted: ?(() => void),
};


type State = {
  enteredCaptchaValue?: string,
};

// TODO: Move into potential GoButton-component
const StyledChevronRight = styled(ChevronRight)`
  height: 1rem;
  vertical-align: bottom;
  opacity: 0.5;
  g, polygon, rect, circle, path {
    fill: white;
  }
`;

// TODO: Move into new component to reuse 
const GoButton = styled.button`
  min-width: 4rem;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1rem;

  color: white;
  background-color: ${colors.linkColor};
  &:hover {
    background-color: ${colors.linkColorDarker};
  }
  &:active {
    background-color: ${colors.darkLinkColor};
  }
`;

/* Overwrite Style of wrapper Toolbar component  */
const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;

  /* TODO: Restyle CloseLink component in ToolBar */
  .close-link {
    min-width: 4rem;
    outline: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1rem;
    color: ${colors.linkColor};
    background-color: transparent;

    &:hover {
      background-color: ${colors.linkBackgroundColor};
    }
    &:active {
      background-color: transparent;
    }
  }

  > header {
    position: sticky;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    height: 50px;
    min-height: 50px;
    z-index: 1;
    border-bottom: 1px ${colors.borderColor} solid;
    background: white;

    > input {
      font-size: 1em;
      flex-grow: 1;
      margin: 6px 20px 6px 0;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid ${colors.linkColor};
    }
  }

  > section {
    overflow: auto;
  }

  @media (max-width: 512px), (max-height: 512px) {
    &.toolbar-iphone-x {
      input, input:focus {
        background-color: white;
      }
    }

    position: fixed;
    top: 0;
    width: 100%;
    max-height: 100%;
    right: 0;
    left: 0;
    margin: 0;
    padding-right: max(constant(safe-area-inset-right), 0px);
    padding-left: max(constant(safe-area-inset-left), 0px);
    padding-right: max(env(safe-area-inset-right), 0px);
    padding-left: max(env(safe-area-inset-left), 0px);
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
    transform: translate3d(0, 0, 0) !important;
    z-index: 1000000000;
    border-radius: 0;

    &:not(.is-expanded) {
      top: 60px;
      left: 10px;
      width: calc(100% - 80px);
      max-height: 100%;
      max-width: 320px;
      margin: 0;
    }

    > header, .search-results, .category-menu {
      padding: 0
    }

    .search-results .link-button {
      margin: 0;
    }

    @media (max-height: 400px) {
      .category-button {
        flex-basis: 16.666666% !important;
      }
    }
  }
`;

/* TODO: prepare stylable component 
const contentBelowSearchField = styled.button`
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    padding: 1em;
    text-align: center;
  
    .captcha-content {
    }

    h3.captcha-help {
    }
    
    small.captcha-explanation {

    }
  }
`;
*/

export default class PhotoUploadCaptchaToolbar extends React.Component<Props, State> {
  props: Props;

  state = {
  };

  inputField: ?HTMLInputElement;
  backLink: ?React.ElementRef<typeof CloseLink>;
  goButton: ?React.ElementRef<'button'>;


  componentDidMount() {
    if (!this.props.hidden) {
      this.focus(); // Focus input field on start
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
  }

  focus() {
    this.inputField && this.inputField.focus();
  }

  renderInputField() {
    return <input type="text"
      ref={inputField => this.inputField = inputField}
      onFocus={(event) => {
        window.scrollTo(0, 0);  // Fix iOS mobile safari viewport out of screen bug
      }}
      onChange={event => this.setState({ enteredCaptchaValue: event.target.value })}
    />;
  }

  renderBackLink() {
    return <button
      className='close-link'
      // translator: Button caption in photo upload captcha dialog
      aria-label={t`Back`}
      onClick={() => {
        if (this.props.onClose) this.props.onClose();
      }}
      ref={backLink => this.backLink = backLink}
    >← </button>;
  }

  renderGoButton() {
    // translator: button shown next to the captcha text input field
    const caption = t`Go!`;
    return <GoButton innerRef={(button) => this.goButton = button} onClick={this.props.onClose}>
      {caption} <StyledChevronRight />
    </GoButton>;
  }

  render() {
    const contentBelowSearchField = <section classname='captcha-container'>
      <div classname='captcha-content'>
        Captcha Container
      </div>
      <h3 classname='captcha-help'>{t`Please type these characters.`}</h3>
      <small classname='captcha-explanation'>{t`Then we know you're not a machine..`}</small>
    </section>;

    return (
      <StyledToolbar
        className='captcha-toolbar'
        hidden={this.props.hidden}
        isSwipeable={false}
        isModal
      >
        <header>
          {this.renderBackLink()}
          {this.renderInputField()}
          {this.renderGoButton()}
        </header>
        <section>
          {contentBelowSearchField}
        </section>
      </StyledToolbar>
    );
  }
}
