// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../../lib/colors';
import { t } from 'c-3po';

type Props = {
  className: string,
};

type State = {
  sourceName: ?string;
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
    const href = "/";  // TDB: Implement this

    return (<a href={href} className={`${className} link-button`}>
      {t`Upload images`}
      <span className='motivation-hint'> {t`Motivational Message`}</span>
    </a>);
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
