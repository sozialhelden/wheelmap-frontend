// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../lib/colors';
import { t } from 'c-3po';

type Props = {
  className: string,
};

type State = {
  sourceName?: string;
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

    return (<div href={href} className={`${className}`}>
      <small>{t`Thank you for work. You contribution will be visible after a quick check.`}</small>
    </div>);
  }
}

const StyledPhotoUploadConfirmation = styled(PhotoUploadConfirmation)`
  /* TODO: implement and style use-case: upload in progress upload successful, upload error, report successful */

  position: relative;
  margin: 0px -6px 10px -6px;
  padding: 8px 8px 8px 54px;
  border-radius: 0 0 4px 4px;
  background: ${colors.coldBackgroundColor};


  /* USECASE: report successful / upload-error
  color: ${colors.negativeColor};
  */

  &:before {
    content: ' ';
    position: absolute;
    left: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    background: yellow; /* debug only */
  }  
`;


export default StyledPhotoUploadConfirmation;
