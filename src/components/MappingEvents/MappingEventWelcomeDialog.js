// @flow

import React from 'react';
import { t } from 'ttag';

import ModalDialog from '../ModalDialog';
import { PrimaryButton } from '../Button';
import { type MappingEvent } from '../../lib/MappingEvent';

type Props = {
  className?: string,
  mappingEvent: MappingEvent,
  onMappingEventWelcomeDialogClose: () => void,
};

const MappingEventWelcomeDialog = ({
  className,
  mappingEvent,
  onMappingEventWelcomeDialogClose,
}: Props) => {
  const dialogAriaLabel = t`Welcome`;

  // translator: The default message for the mapping event welcome dialog
  const defaultWelcomeMessage = t`You are now part of the mapping event ${mappingEvent.name} ❤ Your next step: Rate and add the accessibility of places.`;

  const mappingEventWelcomeMessage = mappingEvent.welcomeMessage || defaultWelcomeMessage;

  return (
    <ModalDialog
      className={className}
      isVisible={true}
      showCloseButton={false}
      onClose={onMappingEventWelcomeDialogClose}
      ariaLabel={dialogAriaLabel}
      ariaDescribedBy="mapping-event-welcome-message"
    >
      <p id="mapping-event-welcome-message">{mappingEventWelcomeMessage}</p>
      <PrimaryButton onClick={onMappingEventWelcomeDialogClose}>{t`Let's go`}</PrimaryButton>
    </ModalDialog>
  );
};

export default MappingEventWelcomeDialog;
