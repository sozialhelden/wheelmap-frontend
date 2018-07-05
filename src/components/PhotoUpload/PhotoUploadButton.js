// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

import CameraIcon from './CameraIcon';

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
        aria-label={t`Upload images`} >
        <span className='button-icon'>
            <CameraIcon />
        </span>
        <span className='button-label'>{t`Upload images`}</span>
        <span className='motivation-hint'> {t`Your Good Deed!`}</span>
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
  
  span.button-icon > svg {
    display: inline-block;
    padding-top: 2px;
    padding-left: 0.2rem;
    font-size: 2em;
  }
  
  span.button-label {
    width: 100%;
    padding: 4px 0;
    margin-left: 0.7rem;    
    color: ${colors.linkColor};
  }
  
  span.motivation-hint {
    font-size: 0.8rem;
    display: inline-block;
    position: relative;
    right: -4px;
    min-width: 7rem;
    padding: 4px 4px 4px 12px;
    color:white;
    background: ${colors.linkColor}; /* fallback */
    background:
      linear-gradient(115deg, transparent 10px, ${colors.linkColor} 0) top left,
      linear-gradient(225deg, transparent 0px, ${colors.linkColor} 0) top right,
      linear-gradient(315deg, transparent 0px, ${colors.linkColor} 0) bottom right,
      linear-gradient(65deg,  transparent 10px, ${colors.linkColor} 0) bottom left;
    background-size: 50% 50%;
    background-repeat: no-repeat;
  }
`;

export default StyledPhotoUploadButton;
