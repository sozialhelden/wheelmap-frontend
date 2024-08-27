import React from 'react'
import { t } from 'ttag'
import ShareIcon from '../icons/actions/ShareIOS'
import { ChromelessButton } from '../shared/Button'

type ShareBarToggleProps = {
  isExpanded: boolean;
  onClick: (hide: boolean | any) => void;
  caption: string;
};

const ShareBarToggle = React.forwardRef(
  (
    { isExpanded, onClick, caption }: ShareBarToggleProps,
    ref: { current: null | HTMLButtonElement },
  ) => {
    // translator: Screenreader description for the button that expands the share menu
    const shareMenuExpandButtonAriaLabel = t`Expand share menu`
    return (
      <ChromelessButton
        ref={ref}
        className="expand-button"
        aria-label={shareMenuExpandButtonAriaLabel}
        aria-expanded={isExpanded}
        onClick={() => onClick(true)}
      >
        <ShareIcon />
        <span>{caption}</span>
      </ChromelessButton>
    )
  },
)

export default ShareBarToggle
