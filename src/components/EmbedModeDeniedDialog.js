import React from 'react';
import ModalDialog from './ModalDialog';
import { t } from 'ttag';

const EmbedModeDeniedDialog = () => {
  // translator: Aria label for dialog showing up when the embedded mode cannot be displayed because of no valid token
  const embedModeDeniedDialogAriaLabel = t`Embed mode can not be used`;
  // translator: Dialog description that the embed mode can not be displayend and where to reach out to
  const embedModeDeniedDescription = `This page can't load this map correctly. Do you own this website? Then reach out:`;

  return (
    <ModalDialog
      isVisible={true}
      ariaDescribedBy="embed-mode-denied-description"
      ariaLabel={embedModeDeniedDialogAriaLabel}
    >
      <p id="embed-mode-denied-description">{embedModeDeniedDescription}</p>
      <p>
        <a href="https://news.wheelmap.org/en/contact/">https://news.wheelmap.org/en/contact/</a>
      </p>
    </ModalDialog>
  );
};

export default EmbedModeDeniedDialog;
