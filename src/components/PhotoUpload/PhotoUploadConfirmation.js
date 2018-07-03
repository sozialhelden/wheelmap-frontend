// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

type Props = {
  className: string,
};

type State = {
  sourceName: ?string;
};

const defaultState: State = {};

class PhotoUploadConfirmation extends React.Component<Props, State> {
  props: Props;
  state: State = defaultState;

  componentDidMount() {
  }

  componentWillReceiveProps(newProps: Props) {
  }

  render() {
    const { className } = this.props;
    const href = "/";  // TDB: Implement this

    return (<span href={href} className={`${className}`}>
      {t`Thank you for work. You contribution will be visible after a quick check.`}
    </span>);
  }
}

const StyledPhotoUploadConfirmation = styled(PhotoUploadConfirmation)`
  /* TODO: Add styling*/
  border:1px solid teal !important;
  span.motivation-hint {
    color:white;
    background-color:black;
  }
`;


export default StyledPhotoUploadConfirmation;
