import {
  FunctionComponent, useEffect, useRef, useState,
} from 'react'
import styled from 'styled-components'
import ShareBarToggle from './ShareBarToggle'
// import ShareBarContent from "./ShareBarContent";
import colors from '../../lib/util/colors'
import { Caption } from '../shared/IconButton'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const shareBarToggleRef = useRef(null)
  const collapseButtonRef = useRef(null)

  useEffect(() => {
    toggleShareBar(false)
  }, [featureId])

  useEffect(() => {
    if (isExpanded && collapseButtonRef) {
      collapseButtonRef.current.focus()
    } else if (!isExpanded && shareBarToggleRef) {
      shareBarToggleRef.current.focus()
    }
  }, [isExpanded])

  const toggleShareBar = (show: boolean | undefined) => {
    setIsExpanded(show !== undefined ? show : !isExpanded)
    if (onToggle) {
      onToggle()
    }
  }

  if (!isExpanded) {
    return (
      <ShareBarToggle
        ref={shareBarToggleRef}
        isExpanded={isExpanded}
        onClick={toggleShareBar}
        caption={shareButtonCaption}
      />
    )
  }

  return (<div>SHARING GOES HERE</div>
  // <ShareBarContent
  //   url={url}
  //   sharedObjectTitle={sharedObjectTitle}
  //   pageDescription={pageDescription}
  //   mailToLink={mailToLink}
  //   className={className}
  //   isExpanded={isExpanded}
  //   ref={collapseButtonRef}
  //   onHide={() => toggleShareBar(false)}
  // />
  )
}

const StyledShareBar = styled(ShareBar)`
  padding: 0 5px 0 0;
  display: flex;
  flex-direction: row !important;

  header {
    min-height: 38px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  button.collapse-button {
    width: 25px;
    padding: 0;
    margin: 0;
    text-align: center;
  }

  footer {
    flex: 1;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: opacity 1s ease-out, max-height 0.15s ease-out;

    &.is-visible {
      max-height: 100px;
      opacity: 1;
    }
  }

  footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  .SocialMediaShareButton,
  a {
    cursor: pointer !important;
    border-radius: 10px;
    &:focus {
      background-color: ${colors.linkBackgroundColorTransparent};
      outline: none;
      border: none;
    }

    svg {
      width: 21px;
      height: 21px;
      opacity: 0.95;
      g {
        fill: white;
      }
    }

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        ${Caption} {
          color: ${colors.linkColor} !important;
        }
      }
    }
  }
`

export default StyledShareBar
