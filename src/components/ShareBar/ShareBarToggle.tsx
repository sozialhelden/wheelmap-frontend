import React, { FunctionComponent, RefObject } from 'react';
import { ChromelessButton } from '../Button';
import ShareIcon from '../icons/actions/ShareIOS';
import { t } from 'ttag';

type ShareBarToggleProps = {
  ref: RefObject<HTMLButtonElement>;
  isExpanded: boolean;
  onClick: () => void;
  caption: string;
};

const ShareBarToggle: FunctionComponent<ShareBarToggleProps> = ({
  ref,
  isExpanded,
  onClick,
  caption,
}) => {
  // translator: Screenreader description for the button that expands the share menu
  const shareMenuExpandButtonAriaLabel = t`Expand share menu`;
  return (
    <ChromelessButton
      ref={ref}
      className="expand-button"
      aria-label={shareMenuExpandButtonAriaLabel}
      aria-expanded={isExpanded}
      onClick={onClick}
    >
      <ShareIcon />
      <span>{caption}</span>
    </ChromelessButton>
  );
};

export default ShareBarToggle;
