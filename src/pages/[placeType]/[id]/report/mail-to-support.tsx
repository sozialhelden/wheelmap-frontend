import '@blueprintjs/core/lib/css/blueprint.css';
import { useRouter } from 'next/router';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogProps,
} from '@blueprintjs/core';
import React from 'react';
import { useCurrentApp } from '../../../../lib/context/AppContext';
import { PlaceInfoNode } from '../../../../lib/fixtures/mocks/nodes/placeinfo';

function ReportSupportMail() {
  const router = useRouter();
  const { placeType, id } = router.query;

  const app = useCurrentApp();
  const { _id } = PlaceInfoNode;
  const { category } = PlaceInfoNode.properties;

  return (
    <>
      <header />
      <h1>Report Support Mail Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
      <ButtonWithDialog
        className="buttonreportdialogemail"
        buttonText="Email me"
        footerStyle="minimal"
        usePortal
        shouldReturnFocusOnClose
        enforceFocus
        canEscapeKeyClose
        canOutsideClickClose
      />
      {/* <Dialog isOpen={true} onClose={() => {}}>
        <DialogBody>TEst</DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog> */}
      {/* <MailToSupportLegacy
        feature={PlaceInfoNode}
        featureId={_id}
        category={category}
        parentCategory={undefined}
        onClose={(
          event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
        ) => {}}
      /> */}
    </>
  );
}

export default ReportSupportMail;

function ButtonWithDialog({
  buttonText,
  footerStyle,
  ...props
}: Omit<DialogProps, 'isOpen'> & {
  buttonText: string;
  footerStyle: 'default' | 'minimal' | 'none';
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleButtonClick = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const handleClose = React.useCallback(() => setIsOpen(false), []);
  const footerActions = (
    <Button onClick={handleClose}>Close</Button>
  );

  return (
    <>
      <Button onClick={handleButtonClick} text={buttonText} />
      <Dialog {...props} isOpen={isOpen} onClose={handleClose}>
        <DialogBody
          useOverflowScrollContainer={
            footerStyle === 'minimal' ? false : undefined
          }
        >
          <p>
            <strong>Dialog... hier öffnet sich der Emaildialog</strong>
          </p>
        </DialogBody>

        {footerStyle === 'default' && (
          <DialogFooter actions={footerActions}>
            Dialog-footerbereich
          </DialogFooter>
        )}

        {footerStyle === 'minimal' && (
          <DialogFooter minimal actions={footerActions} />
        )}
      </Dialog>
    </>
  );
}
