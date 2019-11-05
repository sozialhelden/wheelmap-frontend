// @flow

import React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import ModalDialog from '../ModalDialog';
import { PrimaryButton } from '../Button';
import { type MappingEvent } from '../../lib/MappingEvent';
import CloseButton from '../CloseButton';

type Props = {
  className?: string,
  mappingEvent: MappingEvent,
  onClose: () => void,
  onJoin: (mappingEventId: string, emailAddress?: string) => void,
};

const UnstyledMappingEventWelcomeDialog = ({ className, mappingEvent, onJoin, onClose }: Props) => {
  const dialogAriaLabel = t`Welcome`;

  // translator: The default message for the mapping event welcome dialog
  const defaultWelcomeMessage = t`You are now part of the mapping event ${mappingEvent.name} ❤ Your next step: Rate and add the accessibility of places.`;

  const mappingEventWelcomeMessage = mappingEvent.welcomeMessage || defaultWelcomeMessage;

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
      <p id="mapping-event-welcome-message">{mappingEventWelcomeMessage}</p>
      <PrimaryButton onClick={() => onJoin(mappingEvent._id, null)}>{t`Let's go`}</PrimaryButton>
    </ModalDialog>
  );
};

const MappingEventWelcomeDialog = styled(UnstyledMappingEventWelcomeDialog)`
  ${CloseButton} {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

export default MappingEventWelcomeDialog;
