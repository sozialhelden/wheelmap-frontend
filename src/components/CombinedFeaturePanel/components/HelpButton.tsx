import {
  Button,
  HotkeysContext,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

export default function HelpButton({ className }: { className?: string }) {
  const [, dispatch] = React.useContext(HotkeysContext);
  const openHelp = React.useCallback(() => {
    dispatch({ type: 'OPEN_DIALOG' });
  }, [dispatch]);
  return (
    <Button
      text="?"
      large
      onClick={openHelp}
      className={className}
    />
  );
}

export const FixedHelpButton = styled(HelpButton)`
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  borderRadius: 50%;
  fontSize: 1rem;
  zIndex: 10;
`;
