// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

type Props = {
  className: string,
  onClick?: ((event: UIEvent) => void),
};

type State = {
  sourceName?: string;
};

const defaultState: State = {};

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
        <span className='button-icon'></span>
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
  /* padding-left: 24px !important; */
  font-weight: 500;
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span.button-icon {
    margin-right: 0.5rem;
  }

  span.button-label {
    align-self: flex-start; 
    padding: 4px;
    color: ${colors.linkColor};
  }

  span.motivation-hint {
    font-size: 0.9em;
    display: inline-block;
    position: relative; */
    right: 0;
    margin-left: 16px;
    padding: 4px;
    color:white;
    background-color: ${colors.linkColor};
  }
`;

export default StyledPhotoUploadButton;
