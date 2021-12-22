import { FunctionComponent, useRef, useState } from 'react';
import { ChromelessButton } from '../Button';
import { t } from 'ttag';
import ShareIcon from '../icons/actions/ShareIOS';
import ChevronLeft from '../ChevronLeft';
import ShareBarToggle from './ShareBarToggle';
import ShareBarContent from './ShareBarContent';

type ShareBarProps = {
  shareButtonCaption: string;
  url: string;
  pageDescription: string;
  sharedObjectTitle: string;
  mailToLink: string;
  featureId: string;
  className?: string;
  onToggle?: () => void;
};

const ShareBar: FunctionComponent<ShareBarProps> = ({
  shareButtonCaption,
  url,
  pageDescription,
  sharedObjectTitle,
  mailToLink,
  featureId,
  className,
  onToggle,
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shareBarToggleRef = useRef(null);
  const collapseButtonRef = useRef(null);

  const toggleShareBar = () => {
    setIsExpanded(!isExpanded);
    if (onToggle) {
      onToggle();
    }
  };

  if (!isExpanded) {
    return (
      <>
        new
        <ShareBarToggle
          ref={shareBarToggleRef}
          isExpanded={isExpanded}
          onClick={toggleShareBar}
          caption={shareButtonCaption}
        />
      </>
    );
  }

  return (
    <ShareBarContent
      url={url}
      sharedObjectTitle={sharedObjectTitle}
      pageDescription={pageDescription}
      mailToLink={mailToLink}
      className={className}
      isExpanded={isExpanded}
      ref={collapseButtonRef}
      onHide={toggleShareBar}
    />
  );
};

export default ShareBar;
