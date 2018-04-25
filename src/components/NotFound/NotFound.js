// @flow

import { t } from 'c-3po';
import get from 'lodash/get';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ModalDialog from '../ModalDialog';
import ChevronRight from '../icons/actions/ChevronRight';
import colors from '../../lib/colors';
import Logo from '../../lib/Logo';


type Props = {
  className: string,
  isVisible: boolean,
  onClose: (() => void),
  reason: ?string | Response | Error,
}

class NotFound extends React.Component<Props> {
  manageFocus = ({nativeEvent}) => {
    if (nativeEvent.key === 'Tab') {
      nativeEvent.preventDefault();
    }
  }

  componentDidUpdate() {
    if (this.props.isVisible) {
      this.focus();
    }
  }

  focus() {
    this.closeButton.focus();
  }

  render() {
    if (!this.props.isVisible) return null;

    const classList = [
      this.props.className,
      'not-found-page',
    ].filter(Boolean);

    // translator: Shown as header text on the error page.
    const errorText = t`Error`;

    // translator: Shown as header text on the error page when the URL is not found.
    const notFoundText = t`It seems this place is not on Wheelmap.`;

    // translator: Shown when device is offline.
    const offlineText = t`It seems we’re offline!`;

    const isNotFound = this.props.error &&
      this.props.error instanceof Response &&
      this.props.error.status === 404;

    debugger
    const isOffline = get(this.props, 'error.response.status') === 3;

    const shouldShowApology = !isNotFound && !isOffline;

    let headerText = errorText;
    if (isNotFound) headerText = notFoundText;
    if (isOffline) headerText = offlineText;

    // translator: Shown as apology text / description on the error page.
    const apologyText = t`Sorry, that shouldn\'t have happened!`;
    // translator: Shown on the error page.
    const returnHomeButtonCaption = t`Return Home`;
    // translator: Shown as button caption when there is no internet connection. Tapping the button retries to load the data.
    const retryCaption = t`Retry`;

    const returnHomeLink = (
      <Link
        to="/"
        className="button-cta-close focus-ring"
        onClick={this.props.onClose}
        onKeyDown={this.manageFocus}
        ref={button => this.closeButton = findDOMNode(button)}
      >
        {returnHomeButtonCaption} <ChevronRight />
      </Link>
    );

    const reloadButton = (
      <button
        className="button-cta-close focus-ring"
        onClick={() => window.location.reload(true)}
      >
        {retryCaption}
      </button>
    );

    return (
      <ModalDialog
        className={classList.join(' ')}
        isVisible={this.props.isVisible}
        ariaDescribedBy='wheelmap-error-text wheelmap-apology-text'
        ariaLabel={t`Error`}
      >
        <header>
          <Logo className="logo" aria-hidden={true} />
          <h1 id="wheelmap-error-text">{headerText}</h1>
        </header>

        {this.props.error && !isNotFound && !isOffline ? <section>
          <p id="error-text">{String(this.props.error).substring(0, 140)}</p>
        </section> : null}

        {shouldShowApology ? <section>
          <p id="wheelmap-apology-text">{apologyText}</p>
        </section> : null}

        <footer>
          {isOffline ? reloadButton : returnHomeLink}
        </footer>
      </ModalDialog>);
  }
}


const StyledNotFound = styled(NotFound)`
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 90%;
  }
  .close-dialog {
    display: none;
  }
  .modal-dialog-content {
    padding: 15px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    .logo {
      width: 200px;
    }
    @media (max-width: 768px) {
      > header {
        .logo {
          width: 150px;
        }
      }
    }
    @media (max-width: 1199px) {
      flex-direction: column !important;
      > footer, > header {
        text-align: center;
        width: 75%;
        margin: 0 12.5%;
      }
    }
    @media (min-width: 1200px) {
      justify-content: center;
      align-items: center;
      > header, footer {
        flex: 1;
      }
      > section {
        flex: 2;
      }
    }

    max-width: 1200px;

    .button-cta-close {
      display: inline-block;
      border: none;
      outline: none;
      color: white;
      background-color: ${colors.linkColor};
      font-size: 1.25em;
      line-height: 1;
      padding: 0.5em 0.75em;
      margin: 1em;
      cursor: pointer;
      > svg {
        margin-left: 10px;
      }

      &.focus-ring {
        box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
        transition: box-shadow 0.2s;
      }
    }
  }

  .error-text {
    opacity: 0.7;
  }
`;

export default StyledNotFound;
