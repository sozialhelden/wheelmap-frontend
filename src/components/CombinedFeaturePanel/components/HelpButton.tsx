import {
  Button,
  HotkeysContext
} from '@blueprintjs/core';
import React from "react";

export default function HelpButton() {
  const [, dispatch] = React.useContext(HotkeysContext);
  const openHelp = React.useCallback(() => {
    dispatch({ type: 'OPEN_DIALOG' });
  }, [dispatch]);
  return (
    <Button
      text="?"
      large
      onClick={openHelp}
      style={{
        position: 'fixed', left: '1rem', bottom: '1rem', borderRadius: '50%', fontSize: '1rem', zIndex: 10,
      }}
    />
  );
}

