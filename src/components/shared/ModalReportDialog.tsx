import * as React from 'react'
import { MutableRefObject } from 'react'

type Props = {
  onClose?: (event) => void;
  isVisible: boolean;
  showCloseButton?: boolean;
  className?: string;
  ariaLabel: string;
  ariaDescribedBy: string;
  children: React.ReactNode;
  ref: React.RefObject<HTMLDialogElement>;
};

const ModalReportDialog = React.forwardRef<HTMLDialogElement, Props>(
  (props: Props, ref: MutableRefObject<HTMLDialogElement>) => {
    const {
      onClose,
      isVisible,
      className,
      ariaLabel,
      ariaDescribedBy,
      children,
    } = props

    // havent found a better way yet to create showModal() functionality on server side
    // browser handles this natively
    // From the docs:
    // "It is recommended to use the .show() or .showModal() methods to render dialogs, rather than the open attribute. If a <dialog> is opened using the open attribute, it will be non-modal."
    // HTMLDialogElement.showModal() sets rest of dom as inert and handles esc key. Found no way to ssr this. These attributes wont do
    // - open
    // - aria-modal={true}

    React.useEffect(() => {
      if (isVisible) {
        ref.current.showModal()
      }
    }, [isVisible])

    return (
      <dialog
        onClose={onClose}
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        ref={ref}
      >
        {children}
      </dialog>
    )
  },
)

export default ModalReportDialog
