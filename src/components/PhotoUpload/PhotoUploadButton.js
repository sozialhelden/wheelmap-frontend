// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'ttag';

import { SecondaryButton, ChromelessButton } from '../Button';
import CameraIcon from './CameraIcon';
import AddPhotoIcon from './AddPhotoIcon';
import { IncentiveHint } from '../NodeToolbar/IncentiveHint';

type Props = {
  className?: string,
  textVisble?: boolean,
  onClick?: (event: UIEvent) => void,
};

class PhotoUploadButton extends React.Component<Props> {
  render() {
    const { className, textVisible } = this.props;

    // translator: Text that incentivizes the user to edit a place's accessibility.
    const hintCaption = t`Your good deed of the day!`;

    return (
      <div className={className}>
        {!textVisible && <IncentiveHint>{hintCaption}</IncentiveHint>}
        <ChromelessButton
          onClick={this.onClick}
          className={`link-button`}
          aria-label={t`Add images`}
        >
          <AddPhotoIcon />
          {textVisible && <span>{t`Add images`}</span>}
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
  font-weight: bold;
  background-color: transparent;

  ${ChromelessButton} {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${colors.linkColor};
  }

  svg {
    width: 3em;
    height: 3em;
  }
`;

export default StyledPhotoUploadButton;
