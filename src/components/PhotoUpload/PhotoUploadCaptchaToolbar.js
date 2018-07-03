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


  /* Restyle CloseLink component in ToolBar */
  .close-link {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: transparent;
    display: flex;
    flex-direction: row-reverse;
    &.has-open-category {
      left: 8px;
    }
  }
`;


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
    const contentBelowSearchField = <section>
      Dragons be here
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
