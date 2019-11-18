import React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import ModalDialog from '../ModalDialog';
import { PrimaryButton } from '../Button';
import CloseButton from '../CloseButton';
import colors from '../../lib/colors';

import { getJoinedMappingEventData } from '../../lib/savedState';
import queryString from 'query-string';
import { MappingEvent } from '../../lib/MappingEvent';

type Props = {
  className?: string,
  mappingEvent: MappingEvent,
  invitationToken: string | null,
  onClose: () => void,
  onJoin: (mappingEventId: string, emailAddress?: string) => void,
};

const EmailRegEx = /(.+)@(.+){2,}\.(.+){2,}/;

const EmailInputForm = (props: {
  collectionMode: 'disabled' | 'required' | 'optional',
  initialEmailAddress: string | null,
  invitationToken: string | null,
  onSubmit: (emailAddress?: string) => void,
}) => {
  const { onSubmit, collectionMode, initialEmailAddress, invitationToken } = props;

  const inputField = React.useRef(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isBusy, setBusy] = React.useState<boolean>(false);
  const showInput = collectionMode !== 'disabled' && !invitationToken;

  const submitHandler = e => {
    e.stopPropagation();
    e.preventDefault();

    const inputValue = inputField.current && inputField.current.value.trim();
    if (!collectionMode || invitationToken || collectionMode === 'disabled') {
      setBusy(true);
      onSubmit();
    } else if (collectionMode === 'optional' && !inputValue) {
      setBusy(true);
      onSubmit();
    } else {
      if (!inputValue) {
        setError(t`Your email address is required!`);
      } else {
        const isValid = EmailRegEx.test(inputValue);
        if (isValid) {
          setBusy(true);
          onSubmit(inputValue);
        } else {
          setError(t`This email address is not valid.`);
        }
      }
    }
  };

  return (
    <form className={error ? 'has-error' : ''} onSubmit={submitHandler}>
      {showInput && (
        <div className={error ? 'form-control is-invalid' : 'form-control'}>
          <label>{t`Email address`}</label>
          <input
            className={error ? 'is-invalid' : ''}
            required={collectionMode === 'required'}
            type="email"
            autoComplete="true"
            defaultValue={initialEmailAddress}
            ref={inputField}
            onFocus={event => {
              window.scrollTo(0, 0); // Fix iOS mobile safari viewport out of screen bug
            }}
            disabled={isBusy}
            // @ts-ignore
            field="email"
          />
          {error && <p className="form-text text-danger">{error}</p>}
        </div>
      )}
      <PrimaryButton disabled={isBusy} onClick={submitHandler}>
        {t`Let’s go`}
      </PrimaryButton>
      {invitationToken && <footer>{t`You are participating as ${initialEmailAddress}.`}</footer>}
    </form>
  );
};

const EmailCollectionModeMessages = {
  required: () => t`To stay in touch with you, you must provide us with your email address.`,
  optional: () => t`To stay in touch with you, please share your email address with us.`,
  disabled: () => null,
};

const UnstyledMappingEventWelcomeDialog = ({
  className,
  mappingEvent,
  onJoin,
  onClose,
  invitationToken,
}: Props) => {
  const dialogAriaLabel = t`Welcome`;

  const collectionMode = mappingEvent.emailCollectionMode || 'disabled';
  const emailCollectionModeMessage = EmailCollectionModeMessages[collectionMode]();

  // translator: Shown on the join mapping event screen, when there is no message defined by the event organizer.
  const defaultMappingEventWelcomeMessage = t`Great! Thanks for joining us.`;
  const mappingEventWelcomeMessage =
    mappingEvent.welcomeMessage || defaultMappingEventWelcomeMessage;

  const { emailAddress: lastUsedEmailAddress } = getJoinedMappingEventData();
  let queryEmailAddress: string | null;
  if (typeof window !== 'undefined') {
    const queryObject = queryString.parse(window.location.search);
    queryEmailAddress = queryObject.emailAddress;
  }

  return (
    <ModalDialog
      className={className}
      isVisible={true}
      showCloseButton={false}
      onClose={onClose}
      ariaLabel={dialogAriaLabel}
      ariaDescribedBy="mapping-event-welcome-message"
    >
      <CloseButton onClick={onClose} />
      <h2>{mappingEvent.name}</h2>
      <p id="mapping-event-welcome-message">{mappingEventWelcomeMessage}</p>
      {!invitationToken && <p>{emailCollectionModeMessage}</p>}
      <EmailInputForm
        initialEmailAddress={queryEmailAddress || lastUsedEmailAddress}
        collectionMode={collectionMode}
        invitationToken={invitationToken}
        onSubmit={emailAddress => onJoin(mappingEvent._id, emailAddress)}
      />
    </ModalDialog>
  );
};

const MappingEventWelcomeDialog = styled(UnstyledMappingEventWelcomeDialog)`
  .modal-dialog-content {
    padding: 20px;

    ${CloseButton} {
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

    input[type='text'],
    input[type='email'],
    input[type='number'],
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
      input[type='text'],
      input[type='email'],
      input[type='number'],
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
`;

export default MappingEventWelcomeDialog;
