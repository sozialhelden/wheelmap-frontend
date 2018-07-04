// @flow

import styled from 'styled-components';
import * as React from 'react';
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
        {t`Upload images`}
        <span className='motivation-hint'> {t`Motivational Message`}</span>
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
  /* TODO: Add styling*/
  border:1px solid teal !important;
  span.motivation-hint {
    color:white;
    background-color:black;
  }
`;


export default StyledPhotoUploadButton;
