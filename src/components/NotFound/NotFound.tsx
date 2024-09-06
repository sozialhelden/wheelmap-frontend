import get from 'lodash/get'
import * as React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

import colors from '../../lib/util/colors'
import ChevronRight from '../icons/actions/ChevronRight'

import Logo from '../App/Logo'
import { PrimaryButton } from '../shared/Button'
import ModalDialog from '../shared/ModalDialog'

type Props = {
  className?: string;
  onReturnHomeClick: () => void;
  statusCode: number;
};

const NotFound: React.FC<Props> = ({
  className,
  onReturnHomeClick,
  statusCode,
}) => {
  const manageFocus = React.useCallback(({ nativeEvent }) => {
    if (nativeEvent.key === 'Tab') {
      nativeEvent.preventDefault()
    }
  }, [])

  const closeButton = React.useRef<HTMLButtonElement>(null)

  const focus = React.useCallback(() => {
    if (!closeButton || !(closeButton instanceof HTMLElement)) {
      return
    }

    closeButton.focus()
  }, [closeButton])

  useEffect(() => focus(), [])

  const classList = [className, 'not-found-page'].filter(Boolean)

  // translator: Shown as header text on the error page.
  const errorText = t`Error`

  // translator: Shown as header text on the error page when the URL is not found.
  const notFoundText = t`This URL does not work anymore. If you think the place does exist, you can use the search to find it.`

  // translator: Shown when device is offline.
  const offlineText = t`Sorry, we are offline!`

  const isNotFound = statusCode === 404

  const isOffline = get(
    { className, onReturnHomeClick, statusCode },
    'error.response.status',
  ) === 3

  const shouldShowApology = !isNotFound && !isOffline

  let headerText = errorText
  if (isNotFound) headerText = notFoundText
  if (isOffline) headerText = offlineText

  // translator: Shown as apology text / description on the error page.
  const apologyText = t`Sorry, that should not have happened!`
  // translator: Shown on the error page.
  const returnHomeButtonCaption = t`Return home`
  // translator: Shown as button when there is no internet connection. Tapping the button retries to load the data.
  const retryCaption = t`Retry`

  const returnHomeLink = (
    <PrimaryButton
      className="button-cta-close focus-visible"
      onClick={onReturnHomeClick}
      onKeyDown={manageFocus}
      ref={closeButton}
    >
      {returnHomeButtonCaption}
      {' '}
      <ChevronRight />
    </PrimaryButton>
  )

  const reloadButton = (
    <PrimaryButton
      className="PrimaryButton-cta-close focus-visible"
      onClick={() => window.location.reload()}
    >
      {retryCaption}
    </PrimaryButton>
  )

  debugger

  return (
    <ModalDialog
      className={classList.join(' ')}
      isVisible
      ariaDescribedBy="wheelmap-error-text wheelmap-apology-text"
      ariaLabel={t`Error`}
    >
      <header>
        <Logo className="logo" aria-hidden />
        <h1 id="wheelmap-error-text">{headerText}</h1>
      </header>

      {shouldShowApology ? (
        <section>
          <p id="wheelmap-apology-text">{apologyText}</p>
        </section>
      ) : null}

      <footer>{isOffline ? reloadButton : returnHomeLink}</footer>
    </ModalDialog>
  )
}

const StyledNotFound = styled(NotFound)`
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 90%;
  }

  .close-dialog {
    display: none;
  }

  .modal-dialog-inner {
    padding: 30px;
  }

  .modal-dialog-content {
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.92);
    padding: 30px;
  }

  .button-cta-close {
    display: inline-flex;
    border: none;
    outline: none;
    color: white;
    background-color: ${colors.linkColor};
    font-size: 1.25em;
    line-height: 1;
    padding: 0.5em 0.75em;
    margin-top: 1em;
    cursor: pointer;

    > svg {
      margin-left: 10px;

      path {
        fill: currentColor; // @TODO Use "currentColor" for all SVG icon shapes.
      }
    }

    &.focus-visible {
      box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
      transition: box-shadow 0.2s;
    }
  }

  .error-text {
    opacity: 0.7;
  }
`

export default StyledNotFound
