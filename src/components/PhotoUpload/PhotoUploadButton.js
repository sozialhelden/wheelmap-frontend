// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'ttag';

import { SecondaryButton, ChromelessButton } from '../Button';
import CameraIcon from './CameraIcon';
import { IncentiveHint } from '../NodeToolbar/IncentiveHint';

type Props = {
  className?: string,
  onClick?: (event: UIEvent) => void,
};

class PhotoUploadButton extends React.Component<Props> {
  render() {
    const { className } = this.props;

    // translator: Text that incentivizes the user to edit a place's accessibility.
    const hintCaption = t`Your good deed of the day!`;

    return (
      <div className={className}>
        <IncentiveHint>{hintCaption}</IncentiveHint>
        <ChromelessButton
          onClick={this.onClick}
          className={`link-button`}
          aria-label={t`Add images`}
        >
          <CameraIcon />
          <span>{t`Add images`}</span>
        </ChromelessButton>
      </div>
    );
  }

  onClick = (event: UIEvent) => {
    if (this.props.onClick) {
      this.props.onClick(event);
      event.preventDefault();
    }
  };
}

const StyledPhotoUploadButton = styled(PhotoUploadButton)`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  font-weight: bold;

  ${ChromelessButton} {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${colors.linkColor};
  }

  svg {
    width: 2em;
    height: 2em;
    margin-right: 0.5rem;
  }
`;

export default StyledPhotoUploadButton;
