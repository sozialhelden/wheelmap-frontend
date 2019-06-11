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

  return (
    <ModalDialog
      className={className}
      isVisible={true}
      showCloseButton={false}
      onClose={onMappingEventWelcomeDialogClose}
      ariaLabel={dialogAriaLabel}
      ariaDescribedBy="mapping-event-welcome-message"
    >
      <p id="mapping-event-welcome-message">{mappingEvent.welcomeMessage}</p>
      <PrimaryButton onClick={onMappingEventWelcomeDialogClose}>Let's go</PrimaryButton>
    </ModalDialog>
  );
};

export default MappingEventWelcomeDialog;
