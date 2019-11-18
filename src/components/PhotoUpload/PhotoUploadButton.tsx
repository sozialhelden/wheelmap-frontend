import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'ttag';

import CameraIcon from './CameraIcon';
import { IncentiveHint } from '../NodeToolbar/IncentiveHint';

type Props = {
  className?: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
};

class PhotoUploadButton extends React.Component<Props> {
  render() {
    const { className } = this.props;

    // translator: Text that incentivizes the user to edit a place's accessibility.
    const hintCaption = t`Your good deed of the day!`;

    return (
      <button
        onClick={this.onClick}
        className={`link-button ${className || ''}`}
        aria-label={t`Add images`}
      >
        <CameraIcon />
        <span className="button-label">{t`Add images`}</span>
        <IncentiveHint>{hintCaption}</IncentiveHint>
      </button>
    );
  }

  onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.onClick) {
      this.props.onClick(event);
      event.preventDefault();
    }
  };
}

const StyledPhotoUploadButton = styled(PhotoUploadButton)`
  display: inline-block;
  font-weight: bold;
  display: flex !important;
  flex-direction: row;
  align-items: center;

  width: 100%;
  margin: 0 0rem 0.5rem !important;
  padding: 10px 1rem !important;

  svg {
    width: 2em;
    height: 2em;
    margin-right: 0.5rem;
  }

  .button-label {
    text-align: left;
    color: ${colors.linkColor};
  }
`;

export default StyledPhotoUploadButton;
