// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'ttag';

import { ChromelessButton } from '../Button';
import AddPhotoIcon from '../icons/ui-elements/AddPhotoIcon';
import { DetailPanelIncentiveHint } from './DetailPanelIncentiveHint';

type Props = {
  className?: string,
  textVisible?: boolean,
  incentiveHintVisible?: boolean,
  onClick?: (event: UIEvent) => void,
};

class DetailPanelPhotoUploadButton extends React.Component<Props> {
  render() {
    const { className, textVisible, incentiveHintVisible } = this.props;

    // translator: Text that incentivizes the user to edit a place's accessibility.
    const hintCaption = t`Your good deed of the day!`;

    return (
      <div className={className}>
        <ChromelessButton
          onClick={this.onClick}
          className={`link-button`}
          aria-label={t`Add images`}
        >
          <AddPhotoIcon />
          {textVisible && <span>{t`Add images`}</span>}
        </ChromelessButton>
        {incentiveHintVisible && <DetailPanelIncentiveHint>{hintCaption}</DetailPanelIncentiveHint>}
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

const StyledDetailPanelPhotoUploadButton = styled(DetailPanelPhotoUploadButton)`
  display: flex;
  align-items: center;
  font-weight: bold;
  background-color: transparent;

  ${ChromelessButton} {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${colors.linkColor};
  }

  ${DetailPanelIncentiveHint} {
    position: absolute;
    bottom: 60px;
    right: 0;
  }

  svg {
    width: 3em;
    height: 3em;
  }
`;

export default StyledDetailPanelPhotoUploadButton;
