// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

import CameraIcon from './CameraIcon';
import { IncentiveHint } from '../NodeToolbar/IncentiveHint';

type Props = {
  className: string,
  onClick?: ((event: UIEvent) => void),
};

type State = {
  sourceName?: string;
};

const defaultState: State = {};

const StyledCameraIcon = styled(CameraIcon)`
  font-size: 2em;

`;

class PhotoUploadButton extends React.Component<Props, State> {
  props: Props;
  state: State = defaultState;

  componentDidMount() {
  }

  componentWillReceiveProps(newProps: Props) {
  }

  render() {
    const { className } = this.props;

    return (
      <button 
        onClick={this.onClick} 
        className={`${className} link-button`}
        aria-label={t`Add images`} >
        <span className='button-icon'>
            <CameraIcon />
        </span>
        <span className='button-label'>{t`Add images`}</span>
        <IncentiveHint>{t`Improve your karma!`}</IncentiveHint>
      </button>
    );
  }

  onClick = (event: UIEvent) => {
    if (this.props.onClick) {
      this.props.onClick(event);
      event.preventDefault();
    }
  }
}

const StyledPhotoUploadButton = styled(PhotoUploadButton)`
  display: inline-block;
  font-weight: bold;
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: calc(100% + 10px);
  margin: 0 -5px !important;
  padding: 0 !important;

  span.button-icon > svg {
    display: inline-block;
    padding-top: 2px;
    padding-left: 0.2rem;
    font-size: 2em;
  }

  span.button-label {
    color: ${colors.linkColor};
  }
`;

export default StyledPhotoUploadButton;
