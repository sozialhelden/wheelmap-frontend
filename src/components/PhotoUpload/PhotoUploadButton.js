// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

import CameraIcon from './CameraIcon';
import { IncentiveHint } from '../NodeToolbar/IncentiveHint';

type Props = {
  className: string;
  onClick?: (event: UIEvent) => void;
};

class PhotoUploadButton extends React.Component<Props> {
  render() {
    const { className } = this.props;

    // translator: Text that incentivizes the user to edit a place's accessibility.
    const hintCaption = t`Deine gute Tat!`;

    return <button onClick={this.onClick} className={`link-button ${className}`} aria-label={t`Bilder hinzufügen`}>
        <CameraIcon />
        <span className="button-label">{t`Bilder hinzufügen`}</span>
        <IncentiveHint>{hintCaption}</IncentiveHint>
      </button>;
  }

  onClick = (event: UIEvent) => {
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
  margin: 0 0rem .5rem !important;
  padding: 10px 1rem !important;

  svg {
    width: 2em;
    height: 2em;
    margin-right: .5rem;
  }

  .button-label {
    text-align: left;
    color: ${colors.linkColor};
  }
`;

export default StyledPhotoUploadButton;