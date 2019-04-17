import React from 'react';
import styled from 'styled-components';

import ModalDialog from '../ModalDialog';
import { PrimaryButton } from '../Button';

const MappingEventWelcomeDialog = ({
  className,
  mappingEvent,
  onMappingEventWelcomeDialogClose,
}) => {
  return (
    <ModalDialog className={className} isVisible={true} onClose={onMappingEventWelcomeDialogClose}>
      {mappingEvent.welcomeMessage}
      <PrimaryButton onClick={onMappingEventWelcomeDialogClose}>Let's go</PrimaryButton>
    </ModalDialog>
  );
};

const StyledMappingEventWelcomeDialog = styled(MappingEventWelcomeDialog)`
  .modal-dialog-fullscreen-overlay {
    background-color: transparent;
  }

  .modal-dialog-content {
    display: flex;
    flex-direction: column;
    padding: 60px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.5s linear;
  }

  ${PrimaryButton} {
    margin-top: 20px;
  }
`;

export default StyledMappingEventWelcomeDialog;
