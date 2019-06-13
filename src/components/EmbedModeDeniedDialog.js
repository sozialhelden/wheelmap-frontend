import React from 'react';
import ModalDialog from './ModalDialog';
import Link from './Link/Link';
import { t } from 'ttag';

type Props = {
  language: string,
};

const EmbedModeDeniedDialog = ({ language }: Props) => {
  // translator: Aria label for dialog showing up when the embedded mode cannot be displayed because of no valid token
  const embedModeDeniedDialogAriaLabel = t`Embed mode can not be used`;
  // translator: Dialog description that the embed mode can not be displayed and where to reach out to
  const embedModeDeniedDescription = `This page can't load this map correctly. Do you own this website? Then reach out:`;

  const contactUrl = language.startsWith('de')
    ? 'https://news.wheelmap.org/kontakt/'
    : 'https://news.wheelmap.org/en/contact/';

  return (
    <ModalDialog
      isVisible={true}
      ariaDescribedBy="embed-mode-denied-description"
      ariaLabel={embedModeDeniedDialogAriaLabel}
    >
      <p id="embed-mode-denied-description">{embedModeDeniedDescription}</p>
      <Link to={contactUrl}>{contactUrl}</Link>
    </ModalDialog>
  );
};

export default EmbedModeDeniedDialog;
