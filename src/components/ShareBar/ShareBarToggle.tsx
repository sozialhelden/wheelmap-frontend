import React from 'react';
import { ChromelessButton } from '../Button';
import ShareIcon from '../icons/actions/ShareIOS';
import { t } from 'ttag';

type ShareBarToggleProps = {
  isExpanded: boolean;
  onClick: (hide: boolean | any) => void;
  caption: string;
};

const ShareBarToggle = React.forwardRef(
  (
    { isExpanded, onClick, caption }: ShareBarToggleProps,
    ref: { current: null | HTMLButtonElement }
  ) => {
    // translator: Screenreader description for the button that expands the share menu
    const shareMenuExpandButtonAriaLabel = t`Expand share menu`;
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
    );
  }
);

export default ShareBarToggle;
