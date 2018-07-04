// @flow

import styled from 'styled-components';
import * as React from 'react';
import colors from '../../../lib/colors';
import { t } from 'c-3po';

type Props = {
  className: string,
  notificationType: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview';
  uploadProgress?: number,  // between 0 and 100
};

type State = {
};

const defaultState: State = {};

class PhotoNotifcation extends React.Component<Props, State> {
  props: Props;
  state: State = defaultState;

  componentDidMount() {
  }

  componentWillReceiveProps(newProps: Props) {
  }

  render() {
    const { className, notificationType, uploadProgress } = this.props;

    const uploadProgressMode = notificationType === 'uploadProgress';
    const uploadFailedMode = notificationType === 'uploadFailed';
    const reportedMode = notificationType === 'reported';
    const waitingForReviewMode = notificationType === 'waitingForReview';

    return (
      <div className={`${className}`}>
        {uploadProgressMode && <small>
          <progress max={100} value={uploadProgress || 0} />
          {t`Upload in Progress.`}
        </small>}
        {uploadFailedMode && <small>{t`Upload Failed.`}</small>}
        {reportedMode && <small>{t`Thanks for reporting this photo. We will take a look.`}</small>}
        {waitingForReviewMode && <small>{t`Thank you for work. You contribution will be visible after a quick check.`}</small>}
      </div>
    );
  }
}

const StyledPhotoNotifcation = styled(PhotoNotifcation)`
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


export default StyledPhotoNotifcation;
