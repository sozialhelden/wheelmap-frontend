import Link from 'next/link'
import { useRouter } from 'next/router'
import * as queryString from 'query-string'
import { useCallback } from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { useCurrentApp } from '../../lib/context/AppContext'
import {
  getJoinedMappingEventData, getUUID, setJoinedMappingEventId, trackMappingEventMembershipChanged, useCurrentMappingEventId,
} from '../../lib/context/MappingEventContext'
import colors from '../../lib/util/colors'
import { PrimaryButton } from '../shared/Button'
import CloseButton from '../shared/CloseButton'
import ModalDialog from '../shared/ModalDialog'
import { EmailInputForm } from './EmailInputForm'
import useDocumentSWR from '../../lib/fetchers/ac/useDocumentSWR'

type Props = {
  mappingEventId: string;
  invitationToken: string | null;
};

const StyledModalDialog = styled(ModalDialog)`
  .modal-dialog-content {
    padding: 20px;

    .close-link {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    form {
      > ${PrimaryButton} {
        max-width: unset;
      }
      footer {
        margin-top: 16px;
        color: ${colors.textMuted};
      }
    }

    /* styled form */

    input[type="text"],
    input[type="email"],
    input[type="number"],
    textarea,
    select {
      width: 100%;

      padding: 0 0.25rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 2rem;

      border: 1px solid ${colors.inputBorder};
      border-radius: 0.25rem;
      box-sizing: border-box;
      box-shadow: none;

      &:focus[data-focus-visible-added] {
        border-color: ${colors.focusOutline};
        box-shadow: 0 0 0px 3px ${colors.focusOutline};
        outline: none;
      }

      &.is-invalid {
        color: ${colors.negativeColor};
        /* border-color: transparent; */
        border-color: ${colors.halfTransparentNegative};
        box-shadow: none;
        &:focus[data-focus-visible-added] {
          border-color: ${colors.halfTransparentNegative};
          box-shadow: 0 0 0px 3px ${colors.halfTransparentNegative};
        }
      }

      &:disabled {
        background-color: transparent;
        color: ${colors.textMuted};
      }
    }

    label {
      line-height: 1.25rem;
      text-align: left;
      display: block;
    }

    /* Define text colors depending on context */

    &:focus-within label {
      color: ${colors.highlightColor};
    }

    .is-invalid label {
      opacity: 1;
      color: ${colors.negativeColor};
    }

    .text-danger {
      color: ${colors.negativeColor};
    }

    /*
      Form text is used for help texts and field validation error messages below the field.
    */
    .form-text {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      font-size: 0.8rem;
      line-height: 1;
      text-align: center;
      align-self: center;
      width: 100%;
      box-sizing: border-box;

      /* Style background color depending on context */
      &.text-danger {
        background-color: ${colors.negativeBackgroundColorTransparent};
      }
    }

    .is-invalid {
      input[type="text"],
      input[type="email"],
      input[type="number"],
      textarea,
      select {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    /* Animate field validation error messages to increase attention */
    .form-text.text-danger {
      @keyframes reveal {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes revealText {
        0% {
          color: transparent;
        }
        100% {
          /* color: unset; */
        }
      }

      animation: reveal 0.3s ease-out both, revealText 0.3s 0.15s ease-out both;
    }
  }
`

export default function MappingEventWelcomeDialog({
  invitationToken,
  mappingEventId,
}: Props) {
  const EmailCollectionModeMessages = {
    required: () => t`To stay in touch with you, you must provide us with your email address.`,
    optional: () => t`To stay in touch with you, please share your email address with us.`,
    disabled: () => null,
  }

  const dialogAriaLabel = t`Welcome`
  const app = useCurrentApp()
  const { tokenString: appToken } = app
  const { data: mappingEvent } = useDocumentSWR({
    type: 'ac:MappingEvent',
    _id: mappingEventId,
    cached: false,
  });
  const collectionMode = mappingEvent?.emailCollectionMode || 'disabled'
  const emailCollectionModeMessage = EmailCollectionModeMessages[
    collectionMode
  ]()

  // translator: Shown on the join mapping event screen, when there is no message defined by the event organizer.
  const defaultMappingEventWelcomeMessage = t`Great! Thanks for joining us.`
  const mappingEventWelcomeMessage = mappingEvent?.welcomeMessage || defaultMappingEventWelcomeMessage

  const { emailAddress: lastUsedEmailAddress } = getJoinedMappingEventData()
  let queryEmailAddress: string | null
  if (typeof window !== 'undefined') {
    const queryObject = queryString.parse(window.location.search)
    queryEmailAddress = queryObject.emailAddress as string
  }

  const router = useRouter()
  const { mutate: mutateMappingEventId } = useCurrentMappingEventId()
  const userUUID = getUUID()
  const joinMappingEvent = useCallback((emailAddress?: string) => {
    setJoinedMappingEventId(mappingEventId)
    trackMappingEventMembershipChanged({
      userUUID, app, reason: 'button', joinedMappingEvent: mappingEvent, emailAddress,
    })
    mutateMappingEventId(null)
    router.push('/', undefined, { shallow: true })
  }, [mappingEvent, userUUID, mutateMappingEventId, router, app, mappingEventId])

  return (
    <StyledModalDialog
      isVisible
      showCloseButton={false}
      ariaLabel={dialogAriaLabel}
      ariaDescribedBy="mapping-event-welcome-message"
    >
      <Link href="/" legacyBehavior>
        <CloseButton />
      </Link>
      <h2>{mappingEvent?.name}</h2>
      <p id="mapping-event-welcome-message">{mappingEventWelcomeMessage}</p>
      {!invitationToken && <p>{emailCollectionModeMessage}</p>}
      <EmailInputForm
        initialEmailAddress={queryEmailAddress || lastUsedEmailAddress}
        collectionMode={collectionMode}
        invitationToken={invitationToken}
        onSubmit={joinMappingEvent}
      />
    </StyledModalDialog>
  )
}
