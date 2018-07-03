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
  enteredInstructionsValue?: string,
};


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


export default class PhotoUploadInstructionsToolbar extends React.Component<Props, State> {
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
      onChange={event => this.setState({ enteredInstructionsValue: event.target.value })}
    />;
  }

  renderCloseLink() {
    return <button
      className='close-link'
      // translator: Button caption in photo upload Instructions dialog
      aria-label={t`Back`}
      onClick={() => {
        if (this.props.onClose) this.props.onClose();
      }}
      ref={backLink => this.backLink = backLink}
    >← </button>;
  }

  render() {
    return (
      <StyledToolbar
        className='photoupload-instructions-toolbar'
        hidden={this.props.hidden}
        isSwipeable={false}
        isModal
      >
        <header>
          {this.renderCloseLink()}
          {t`The following impages...`}
        </header>
        <section>
          <ul>
            <li>Point 1</li>
            <li>Point 2</li>
          </ul>
        </section>
        <footer>
          <button className='link-button negative-button'>{t`Cancel`}</button>
          <button className='link-button primary-button'>{t`Continue`}</button>
        </footer>
      </StyledToolbar>
    );
  }
}
